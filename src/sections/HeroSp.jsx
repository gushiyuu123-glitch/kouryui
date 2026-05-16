// src/sections/HeroSp.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroSp.module.css";

let _stReady = false;
if (typeof window !== "undefined" && !_stReady) {
  gsap.registerPlugin(ScrollTrigger);
  _stReady = true;
}

const BG_SRC = "/herosp111-16x9.png";
const SEAL_SRC = "/sirusi.svg";

// ✅ CSSの .veil { opacity: ... } と合わせる
const BASE_VEIL = 0.78;

export default function HeroSp() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    let st = null;
    let tl = null;

    const ctx = gsap.context(() => {
      const bg = root.querySelector("[data-bg]");
      const veil = root.querySelector("[data-veil]");
      const stack = root.querySelector("[data-stack]");
      if (!bg || !veil || !stack) return;

      // reduced motion：静止で完成
      if (reduce) {
        gsap.set(bg, { opacity: 1, scale: 1.03, clearProps: "filter" });
        gsap.set(stack, { opacity: 1, y: 0, clearProps: "transform" });
        gsap.set(veil, { opacity: BASE_VEIL });
        return;
      }

      // 初期
      gsap.set(bg, { opacity: 0, scale: 1.06, transformOrigin: "center" });
      gsap.set(stack, { opacity: 0, y: 14 });
      gsap.set(veil, { opacity: BASE_VEIL });

      // intro
      tl = gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to(bg, { opacity: 1, scale: 1.03, duration: 1.05 }, 0)
        .to(stack, { opacity: 1, y: 0, duration: 0.72 }, 0.16);

      // ✅ onUpdate は quickSetter（SPを軽くする）
      const setVeil = gsap.quickSetter(veil, "opacity");
      const setFilter = gsap.quickSetter(bg, "filter");

      st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: ({ progress: p }) => {
          setVeil(BASE_VEIL - p * 0.42);
          setFilter(`saturate(${0.98 + p * 0.08}) contrast(1.02)`);
        },
      });
    }, root);

    return () => {
      st?.kill();
      tl?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="top-sp" data-hero className={styles.hero}>
      <img
        data-bg
        className={styles.bg}
        src={BG_SRC}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <div className={styles.grain} aria-hidden="true" />
      <div data-veil className={styles.veil} aria-hidden="true" />

      <div data-stack className={styles.stack}>
        {/* 情報（主役にしない） */}
        <div className={styles.meta} aria-label="service notes">
          <p className={styles.metaLine}>那覇・国際通りエリア</p>
          <p className={styles.metaLine}>着付け込み / 手ぶらOK</p>
        </div>

        {/* 主役：コピー */}
        <div className={styles.copy}>
          <h1 className={styles.h1}>
            <span className={styles.h1Line}>紅を纏う。</span>
            <span className={styles.h1Line}>那覇で、一日だけ。</span>
          </h1>

          <p className={styles.desc}>
            琉球衣装レンタル（着付け込み）。
            <br />
            迷ったまま送って大丈夫です。
          </p>

          <div className={styles.ctaRow}>
            <a className={styles.cta} href="#reserve">
              予約する
            </a>
            <a className={styles.sub} href="#gallery">
              写真を見る
            </a>
          </div>
        </div>

        {/* 署名（ロゴ降格） */}
        <div className={styles.signature} aria-label="brand signature">
          <img
            className={styles.seal}
            src={SEAL_SRC}
            alt=""
            aria-hidden="true"
            decoding="async"
          />
          <div className={styles.sigText}>
            <div className={styles.sigJp}>紅琉衣</div>
            <div className={styles.sigEn} aria-hidden="true">
              KOU RYUI
            </div>
          </div>
        </div>

        {/* SCROLL（右下へ・控えめはCSS側で） */}
        <div className={styles.scroll} aria-hidden="true">
          SCROLL
        </div>
      </div>
    </section>
  );
}