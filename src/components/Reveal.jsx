import { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./Reveal.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* -----------------------------
   GSAP init (once)
------------------------------ */
let _gsapRegistered = false;
function ensureGsap() {
  if (typeof window === "undefined") return;
  if (_gsapRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  _gsapRegistered = true;
}

/* -----------------------------
   IO pooling (fast / stable)
------------------------------ */
const IO_POOL = new Map();
const CB_POOL = new WeakMap();

const prefersReduce = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function getKey(rootMargin, threshold) {
  const t = Array.isArray(threshold) ? threshold.join(",") : String(threshold);
  return `${rootMargin}__${t}`;
}

function getIO({ rootMargin, threshold }) {
  const key = getKey(rootMargin, threshold);
  if (IO_POOL.has(key)) return IO_POOL.get(key);

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = CB_POOL.get(entry.target);
        if (cb) cb();
        CB_POOL.delete(entry.target);
        obs.unobserve(entry.target);
      }
    },
    { root: null, rootMargin, threshold }
  );

  IO_POOL.set(key, io);
  return io;
}

function useInViewOnce(ref, onEnter, opts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    if (prefersReduce() || !("IntersectionObserver" in window)) {
      onEnter();
      return;
    }

    const io = getIO(opts);
    CB_POOL.set(el, onEnter);
    io.observe(el);

    return () => {
      CB_POOL.delete(el);
      try {
        io.unobserve(el);
      } catch {
        /* no-op */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function toSeconds(d) {
  if (typeof d === "number") return d;
  if (!d) return 0;
  const s = String(d).trim();
  if (s.endsWith("ms")) return Math.max(0, parseFloat(s) / 1000);
  return Math.max(0, parseFloat(s)); // "0.12s" -> 0.12
}

/* -----------------------------
   SP判定：スマホはGSAP禁止（IO固定）
   - coarse + small width だけを「SP扱い」にする
------------------------------ */
function isPhoneLike() {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia?.("(pointer: coarse) and (max-width: 900px)");
  if (mq) return mq.matches;
  return window.innerWidth <= 900;
}

/* -----------------------------
   RevealText
------------------------------ */
export function RevealText({
  as: Tag = "div",
  className = "",
  d = "0s",
  rootMargin = "0px 0px -18% 0px",
  threshold = 0.01,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useInViewOnce(
    ref,
    () => ref.current?.classList.add(styles.in),
    { rootMargin, threshold },
    true
  );

  return (
    <Tag
      ref={ref}
      className={`${styles.text} ${className}`}
      style={{ "--d": d }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* -----------------------------
   RevealImage
------------------------------ */
export function RevealImage({
  className = "",
  imgClassName = "",
  d = "0s",
  src,
  alt = "",
  ratio = "16/9",

  /* mode:
     - "auto": PCはGSAP、SPはIOに強制
     - "gsap": GSAP ScrollTrigger（SPでは無効化されIOへ）
     - "io"  : IO + CSS transition（全端末OK）
  */
  mode = "auto",
  start = "top 78%",
  rootMargin = "0px 0px -22% 0px",
  threshold = 0.01,

  loading = "lazy",
  decoding = "async",
}) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const wipeRef = useRef(null);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const phoneLike = typeof window !== "undefined" && isPhoneLike();

  // ✅ SPは必ずIO（ScrollTrigger増殖を止める）
  const useGsap =
    !reduce &&
    !phoneLike &&
    (mode === "gsap" || (mode === "auto" && typeof window !== "undefined"));

  /* GSAP mode (PC only) */
  useLayoutEffect(() => {
    if (!useGsap) return;
    ensureGsap();

    const frame = frameRef.current;
    const img = imgRef.current;
    const wipe = wipeRef.current;
    if (!frame || !img || !wipe) return;

    if (prefersReduce()) {
      frame.classList.add(styles.in);
      return;
    }

    const DUR = { frame: 0.68, wipe: 1.02, img: 1.28 };
    const INIT = { scale: 1.08, y: 10 };

    gsap.set(frame, { opacity: 0, y: 18 });
    gsap.set(img, { scale: INIT.scale, y: INIT.y });
    gsap.set(wipe, { yPercent: 0 });

    const delay = toSeconds(d);

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: frame, start, once: true },
    });

    if (delay > 0) tl.delay(delay);

    tl.to(frame, { opacity: 1, y: 0, duration: DUR.frame }, 0.0);
    tl.to(img, { scale: 1.02, y: 0, duration: DUR.img }, 0.0);
    tl.to(wipe, { yPercent: -112, duration: DUR.wipe }, 0.12);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [useGsap, start, d]);

  /* IO mode (SP / or when GSAP is off) */
  useInViewOnce(
    frameRef,
    () => frameRef.current?.classList.add(styles.in),
    { rootMargin, threshold },
    !useGsap
  );

  return (
    <figure
      ref={frameRef}
      className={[styles.image, useGsap ? styles.isGsap : "", className].join(
        " "
      )}
      style={{ "--d": d, "--ratio": ratio }}
    >
      {/* wipeはPCで使う。SPではCSSでdisplay:noneにする */}
      <span ref={wipeRef} className={styles.wipe} aria-hidden="true" />
      <img
        ref={imgRef}
        className={`${styles.img} ${imgClassName}`}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
      />
    </figure>
  );
}