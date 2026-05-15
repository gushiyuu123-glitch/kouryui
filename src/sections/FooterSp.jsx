// src/sections/FooterSp.jsx
import { useEffect, useRef } from "react";
import styles from "./FooterSp.module.css";

const BASE_URL = "https://gushikendesign.com/";

function IconMap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 18l-4 2V6l4-2 6 2 4-2v14l-4 2-6-2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9 4v14M15 6v14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconArrow(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10 7h7v7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FooterSp() {
  const rootRef = useRef(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const show = () => el.classList.add(styles.in);
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduce || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        io.disconnect();
      },
      { threshold: 0.01, rootMargin: "0px 0px -18% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer ref={rootRef} className={styles.footer} aria-labelledby="footer-label">
      <div className={styles.wrap}>
        {/* watermark */}
        <img className={styles.watermark} src="/sirusi.svg" alt="" aria-hidden="true" />

        {/* ===== Brand block ===== */}
        <div className={`${styles.brand} ${styles.reveal}`} style={{ "--d": "0.00s" }}>
          <div className={styles.brandTop}>
            <div className={styles.stamp} aria-hidden="true">
              <span className={styles.stampInk} aria-hidden="true" />
              <img className={styles.stampMark} src="/sirusi.svg" alt="" aria-hidden="true" />
            </div>

            <div className={styles.brandText}>
              <div className={styles.kicker} aria-hidden="true">
                KOU RYUI
              </div>

              <h2 id="footer-label" className={styles.title}>
                紅琉衣
              </h2>

              <p className={styles.lead}>
                那覇・国際通りエリア｜琉球衣装レンタル（着付け込み）
              </p>
            </div>
          </div>

          {/* SEOは2行で止める */}
          <p className={styles.seo} aria-label="service summary">
            <span className={styles.seoLine}>那覇で一日、琉球衣装で過ごすサービスです。</span>
            <span className={styles.seoLine}>衣装・着付け・草履・小物、すべて込みです。</span>
          </p>

          {/* 最後の一押し（ボタンにしない） */}
          <a className={styles.lastPush} href="#reserve">
            迷ったまま送ってください <span className={styles.lastArrow} aria-hidden="true">→</span>
          </a>
        </div>

        {/* ===== Nav ===== */}
        <nav className={`${styles.nav} ${styles.reveal}`} style={{ "--d": "0.10s" }} aria-label="footer navigation">
          <a href="#plan">プラン</a>
          <a href="#costume">色</a>
          <a href="#gallery">写真</a>
          <a href="#flow">当日の流れ</a>
          <a href="#qa">ご質問</a>
          <a href="#access">アクセス</a>
          <a href="#reserve">予約</a>
          <a href="#top">トップへ</a>
        </nav>

        {/* ===== Quick links (逃げ道だけ) ===== */}
        <div className={`${styles.quick} ${styles.reveal}`} style={{ "--d": "0.16s" }} aria-label="quick links">
          <a className={styles.quickBtn} href="#access">
            <span className={styles.quickIcon} aria-hidden="true">
              <IconMap className={styles.svg} />
            </span>
            <span className={styles.quickText}>場所を見る</span>
          </a>

          <a className={`${styles.quickBtn} ${styles.primary}`} href="#reserve">
            <span className={styles.quickIcon} aria-hidden="true">
              <IconArrow className={styles.svg} />
            </span>
            <span className={styles.quickText}>予約へ</span>
          </a>
        </div>

        {/* ===== Bottom ===== */}
        <div className={`${styles.bottom} ${styles.reveal}`} style={{ "--d": "0.22s" }}>
          <a className={styles.base} href={BASE_URL} target="_blank" rel="noreferrer">
            GUSHIKEN DESIGN（本拠地）↗
          </a>
          <div className={styles.copy}>© {year} KOU RYUI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}