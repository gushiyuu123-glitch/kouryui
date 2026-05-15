// src/sections/Gallery.jsx
import { useLayoutEffect, useRef } from "react";
import styles from "./Gallery.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* register once (HMRでも上品) */
let _stReady = false;
if (typeof window !== "undefined" && !_stReady) {
  gsap.registerPlugin(ScrollTrigger);
  _stReady = true;
}

const SHOTS = [
  {
    id: "a",
    no: "01",
    time: "DAY",
    tone: "beni",
    title: "昼は、光がいちばん素直。",
    note: "やわらかい光 / 散策向け",
    src: "/plan-01.png",
    alt: "昼の石畳。紅の衣が光に映える。",
  },
  {
    id: "b",
    no: "02",
    time: "DUSK",
    tone: "kogane",
    title: "夕暮れは、色が深くなる。",
    note: "一番選ばれている時間帯 / 影が締まる",
    src: "/plan-02.png",
    alt: "夕方の国際通り。衣の色が深く見える。",
  },
  {
    id: "c",
    no: "03",
    time: "NIGHT",
    tone: "ai",
    title: "灯りで、輪郭が出る。",
    note: "夜間対応 / 灯りの時間",
    src: "/plan-03.png",
    alt: "夜の灯り。衣の輪郭が立つ。",
  },
];

const prefersReduce = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

export default function Gallery() {
  const stageRef = useRef(null);
  const headRef = useRef(null);
  const panelsRef = useRef([]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduce = prefersReduce();
    const panels = panelsRef.current.filter(Boolean);

    const head = headRef.current;
    const hk = head?.querySelector("[data-kicker]");
    const ht = head?.querySelector("[data-title]");
    const hb = head?.querySelector("[data-beni]");
    const hl = head?.querySelector("[data-lead]");
    const hh = head?.querySelector("[data-hair]");

    const ctx = gsap.context(() => {
      // init panels
      panels.forEach((el) => {
        const mask = el.querySelector("[data-mask]");
        const img = el.querySelector("img");
        const cap = el.querySelector("[data-cap]");
        if (!mask || !img || !cap) return;

        gsap.set(mask, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(el, { opacity: 0, y: 22 });
        gsap.set(img, { scale: 1.09, y: -12 });
        gsap.set(cap, { opacity: 0, y: 10 });
      });

      // init header (JSだけで初期化)
      if (hk && ht && hb && hl && hh) {
        gsap.set(hk, { opacity: 0, y: 10 });
        gsap.set(ht, { opacity: 1, y: 14, clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(hb, {
          opacity: 0,
          y: 8,
          scale: 0.985,
          transformOrigin: "50% 80%",
        });
        gsap.set(hl, { opacity: 0, y: 10 });
        gsap.set(hh, { opacity: 0, scaleX: 0, transformOrigin: "0% 50%" });
      }

      if (reduce) {
        // panels final
        panels.forEach((el) => {
          const mask = el.querySelector("[data-mask]");
          const img = el.querySelector("img");
          const cap = el.querySelector("[data-cap]");
          if (!mask || !img || !cap) return;

          gsap.set(mask, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(el, { opacity: 1, y: 0 });
          gsap.set(img, { scale: 1.02, y: 0 });
          gsap.set(cap, { opacity: 1, y: 0 });
        });

        // header final
        if (hk && ht && hb && hl && hh) {
          gsap.set(hk, { opacity: 1, y: 0 });
          gsap.set(ht, { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(hb, { opacity: 1, y: 0, scale: 1 });
          gsap.set(hl, { opacity: 1, y: 0 });
          gsap.set(hh, { opacity: 1, scaleX: 1 });
        }
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: stage,
          start: "top 70%",
          once: true,
        },
      });

      // header “刻印”
      if (hk && ht && hb && hl && hh) {
        tl.to(hk, { opacity: 1, y: 0, duration: 0.36 }, 0.00);
        tl.to(ht, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.92 }, 0.06);
        tl.to(hb, { opacity: 1, y: 0, scale: 1, duration: 0.44 }, 0.34);
        tl.to(hl, { opacity: 1, y: 0, duration: 0.42 }, 0.48);
        tl.to(hh, { opacity: 1, scaleX: 1, duration: 0.78, ease: "power2.out" }, 0.58);
      }

      // panels
      let t = 0.10;
      panels.forEach((el) => {
        const mask = el.querySelector("[data-mask]");
        const img = el.querySelector("img");
        const cap = el.querySelector("[data-cap]");
        if (!mask || !img || !cap) return;

        tl.to(el, { opacity: 1, y: 0, duration: 0.40 }, t);
        tl.to(mask, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.92 }, t + 0.02);
        tl.to(img, { scale: 1.02, y: 0, duration: 1.10 }, t);
        tl.to(cap, { opacity: 1, y: 0, duration: 0.46 }, t + 0.28);

        t += 0.22;
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" className={styles.section} aria-labelledby="galleryTitle">
      <div className={styles.wrap}>
        <div ref={stageRef} className={styles.stage}>
          {/* 名札 */}
          <header ref={headRef} className={styles.head}>
            <div className={styles.kicker} data-kicker>GALLERY</div>
            <h2 className={styles.title} id="galleryTitle" data-title>
              琉装の<span className={styles.beni} data-beni>三景</span>
            </h2>
    <p className={styles.lead} data-lead>
  <span className={styles.tBeni}>昼</span>
  <span className={styles.sep}> / </span>
  <span className={styles.tKogane}>夕暮れ</span>
  <span className={styles.sep}> / </span>
  <span className={styles.tAi}>夜</span>
</p>
            <div className={styles.hair} data-hair aria-hidden="true" />
          </header>

          {SHOTS.map((s, i) => (
            <figure
              key={s.id}
              ref={(el) => (panelsRef.current[i] = el)}
              className={styles.panel}
              data-pos={s.id}
              data-tone={s.tone}
            >
              <div className={styles.mask} data-mask>
                <img
                  className={styles.img}
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <figcaption className={styles.cap} data-cap>
     <div className={styles.capTop}>
  <span className={styles.capNo}>{s.no}</span>

  <span className={`${styles.capTime} ${styles.toneText} ${styles[`tone_${s.tone}`]}`}>
    {s.time}
  </span>
</div>
                <div className={styles.capTitle}>{s.title}</div>
                <div className={styles.capNote}>{s.note}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}