import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

let _stReady = false;
if (typeof window !== "undefined" && !_stReady) {
  gsap.registerPlugin(ScrollTrigger);
  _stReady = true;
}

const LOGO_SRC = "/kouryui1.svg";

// ─── アニメーション定数 ────────────────────────────────────────
const BG_FINAL_SCALE = 1.03;

// ─── helpers ──────────────────────────────────────────────────
function buildIntroTimeline(bg, nav, logo, copy, meta) {
  gsap.set(bg, {
    opacity: 0,
    scale: BG_FINAL_SCALE + 0.02,
    transformOrigin: "center",
  });
  gsap.set([nav, logo, copy, meta].filter(Boolean), { opacity: 0, y: 14 });

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .to(
      bg,
      { opacity: 1, scale: BG_FINAL_SCALE, duration: 1.05, ease: "power2.out" },
      0.0
    )
    .to(nav, { opacity: 1, y: 0, duration: 0.55 }, 0.06)
    .to(logo, { opacity: 1, y: 0, duration: 0.62 }, 0.14)
    .to(copy, { opacity: 1, y: 0, duration: 0.58 }, 0.20)
    .to(meta, { opacity: 1, y: 0, duration: 0.54 }, 0.26);
}

function buildScrollTrigger(root, veil, bg) {
  const setVeilOpacity = gsap.quickSetter(veil, "opacity");
  const setBgFilter = gsap.quickSetter(bg, "filter");

  return ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "bottom top",
    scrub: 0.6,
    onUpdate({ progress: p }) {
      setVeilOpacity(1 - p * 0.55);
      setBgFilter(`saturate(${0.98 + p * 0.08}) contrast(1.02)`);
    },
  });
}

// ─── コンポーネント ────────────────────────────────────────────
export default function Hero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    let st;

    const ctx = gsap.context(() => {
      const bg = root.querySelector("[data-bg]");
      const veil = root.querySelector("[data-veil]");
      const nav = root.querySelector("[data-nav]");
      const meta = root.querySelector("[data-meta]");
      const logo = root.querySelector("[data-logo]");
      const copy = root.querySelector("[data-copy]");

      if (!bg || !veil || !nav || !logo || !copy) return;

      if (prefersReduced) {
        // ✅ 演出だけ止める（デザインの重心は残す）
        gsap.set(bg, { opacity: 1, scale: BG_FINAL_SCALE });
        gsap.set(veil, { opacity: 1 });
        gsap.set([nav, logo, copy, meta].filter(Boolean), { opacity: 1, y: 0 });
        return;
      }

      buildIntroTimeline(bg, nav, logo, copy, meta);
      st = buildScrollTrigger(root, veil, bg);
    }, root);

    return () => {
      st?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="top" data-hero className={styles.hero}>
      {/* 背景レイヤー */}
      <img
        data-bg
        className={styles.bg}
        src="/hero1-16x9.png"
        alt=""
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
      <div className={styles.grain} />
      <div data-veil className={styles.veil} />

      {/* コンテンツ */}
      <div className={styles.wrap}>
        {/* ヘッダー行（右カラム基準） */}
        <div className={styles.headerRow}>
          <div className={styles.blank} aria-hidden />
          <div className={styles.headerRight}>
            <nav data-nav className={styles.nav} aria-label="primary">
              <a href="#plan">プラン</a>
              <a href="#costume">衣装</a>
              <a href="#access">アクセス</a>
            </nav>

            <div
              data-meta
              className={styles.cornerMeta}
              aria-label="service notes"
            >
  <p className={styles.subLead}>
    国際通りエリア｜琉球衣装レンタル
  </p>
            </div>
          </div>
        </div>

        {/* メインステージ */}
        <div className={styles.stage}>
          <div className={styles.blank} aria-hidden />

          <div className={styles.right}>
            {/* ロゴ */}
            <div
              data-logo
              className={styles.logoFx}
              style={{ ["--logo-mask"]: `url(${LOGO_SRC})` }}
            >
              {/* 人間味：刷りムラ（超薄） */}
              <span className={styles.ink} aria-hidden="true" />

              <img className={styles.logo} src={LOGO_SRC} alt="紅琉衣（KOU RYUI）" />

              <div className={styles.roman} aria-hidden="true">
                KOU RYUI
              </div>
            </div>

            {/* コピー + CTA（塊） */}
            <div data-copy className={styles.copyBlock}>
              <p className={styles.lead}>
                紅を纏う。那覇で、琉球衣装を一日レンタル。
              </p>


              <div className={styles.ctaRow}>
                <a className={styles.cta} href="#reserve">予約する</a>
                <a className={styles.sub} href="#gallery">衣装を見る</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}