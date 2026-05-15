// src/sections/Footer.jsx
import { useEffect, useRef } from "react";
import styles from "./Footer.module.css";

const BASE_URL = "https://gushikendesign.com/";

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 3.8h9A3.7 3.7 0 0 1 20.2 7.5v9a3.7 3.7 0 0 1-3.7 3.7h-9a3.7 3.7 0 0 1-3.7-3.7v-9A3.7 3.7 0 0 1 7.5 3.8Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M12 15.7a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M17.6 6.9h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

export default function Footer() {
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
      { threshold: 0.01, rootMargin: "0px 0px -20% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer
      ref={rootRef}
      className={styles.footer}
      aria-labelledby="footer-label"
    >
      <div className={styles.wrap}>
        {/* watermark (sirusi) */}
        <img
          className={styles.watermark}
          src="/sirusi.svg"
          alt=""
          aria-hidden="true"
        />

        <div className={styles.top}>
          {/* Brand / SEO */}
          <div className={styles.brand}>
            <div
              className={`${styles.brandRow} ${styles.reveal}`}
              style={{ "--d": "0.00s" }}
            >
              <div className={styles.mark} aria-hidden="true">
                <img className={styles.sirusi} src="/sirusi.svg" alt="" />
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

            <p className={`${styles.seo} ${styles.reveal}`} style={{ "--d": "0.06s" }}>
              <span className={styles.seoLine}>
                那覇で一日、琉球衣装で過ごすサービスです。
              </span>
              <span className={styles.seoLine}>
                衣装・着付け・草履・小物、すべて込みです。
              </span>
            </p>

            <p className={`${styles.lastPush} ${styles.reveal}`} style={{ "--d": "0.10s" }}>
              連絡は予約フォームからでOKです。
              <br />
              迷ったまま送ってください。
            </p>
          </div>

          {/* Nav / Social */}
          <div className={styles.right}>
            <nav
              className={`${styles.nav} ${styles.reveal}`}
              style={{ "--d": "0.12s" }}
              aria-label="footer navigation"
            >
              <a href="#plan">プラン</a>
              <a href="#costume">衣装</a>
              <a href="#gallery">ギャラリー</a>
              <a href="#flow">当日の流れ</a>
              <a href="#qa">よくある質問</a>
              <a href="#access">アクセス</a>
              <a href="#reserve">予約</a>
              <a href="#top">トップへ</a>
            </nav>

            <div className={`${styles.social} ${styles.reveal}`} style={{ "--d": "0.18s" }}>
              <div className={styles.socialHead}>
                <span className={styles.socialKicker}>LINKS</span>
                <span className={styles.socialRule} aria-hidden="true" />
              </div>

              {/* ダミーリンク運用OK（あとで本物に差し替え） */}
              <div className={styles.icons}>
                <a
                  className={styles.iconBtn}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Instagram（準備中）"
                >
                  <IconInstagram className={styles.svg} />
                </a>

                <a
                  className={styles.iconBtn}
                  href="#access"
                  aria-label="アクセスへ"
                >
                  <IconMap className={styles.svg} />
                </a>

                <a
                  className={styles.iconBtn}
                  href="#reserve"
                  aria-label="予約へ"
                >
                  <IconArrow className={styles.svg} />
                </a>

                <a
                  className={`${styles.iconBtn} ${styles.iconSirusi}`}
                  href="#top"
                  aria-label="トップへ（印）"
                >
                  <img src="/sirusi.svg" alt="" aria-hidden="true" />
                </a>
              </div>

              <p className={styles.socialNote}>
                最後は「予約」だけ押せれば十分です。
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className={`${styles.bottom} ${styles.reveal}`} style={{ "--d": "0.24s" }}>
          <a className={styles.base} href={BASE_URL} target="_blank" rel="noreferrer">
            GUSHIKEN DESIGN（本拠地 / Portfolio）↗
          </a>

          <div className={styles.copy}>© {year} KOU RYUI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}