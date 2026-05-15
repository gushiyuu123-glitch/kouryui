// src/sections/Access.jsx
import { useEffect, useMemo, useRef } from "react";
import styles from "./AccessSp.module.css";

const MAP_IMG = "/access-map.png";

const ACCESS = {
  area: "那覇・国際通りエリア",
  address: "〒900-0013 沖縄県那覇市牧志 1-2-3 1F",
  landmark: "国際通りの「てんぶす那覇」向かいのビル 1F",
  yui: [
    "ゆいレール「美栄橋駅」から徒歩 約5分",
    "ゆいレール「牧志駅」から徒歩 約6分",
  ],
  taxi: "「国際通り・てんぶす那覇向かいのビル」とお伝えください。",
  car: "近隣のコインパーキングをご利用ください。店舗周辺に複数ございます。",
};

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ACCESS.address} ${ACCESS.landmark}`
)}`;

function IconTrain(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 3h10a3 3 0 0 1 3 3v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 19l-2 2M16 19l2 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M7 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M9 14h.01M15 14h.01"
        stroke="currentColor"
        strokeWidth="2.0"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTaxi(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 6h10l2 5v7H5v-7l2-5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9 6l1-2h4l1 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M7 13h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M8 17h.01M16 17h.01"
        stroke="currentColor"
        strokeWidth="2.0"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconParking(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 4h8a5 5 0 0 1 0 10H9v6H6V4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AccessSp() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    if (!section || !trigger) return;

    const show = () => section.classList.add(styles.in);

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
      { threshold: 0.01, rootMargin: "0px 0px -26% 0px" }
    );

    io.observe(trigger);
    return () => io.disconnect();
  }, []);

  const yuiLines = useMemo(() => ACCESS.yui, []);

  return (
    <section
      ref={sectionRef}
      id="access"
      className={styles.section}
      aria-labelledby="access-label"
    >
      <div className={styles.wrap}>
        {/* LEFT */}
        <div className={styles.left} ref={triggerRef}>
          <header className={styles.head}>
            <div className={`${styles.kicker} ${styles.reveal}`} style={{ "--d": "0.00s" }}>
              ACCESS
            </div>

            <h2 id="access-label" className={`${styles.title} ${styles.reveal}`} style={{ "--d": "0.06s" }}>
              アクセス
            </h2>

            <p className={`${styles.sub} ${styles.reveal}`} style={{ "--d": "0.12s" }}>
              必要な情報だけ、短くまとめました。
            </p>
          </header>

          <div className={styles.blocks}>
            {/* 01 */}
            <div className={`${styles.block} ${styles.reveal}`} style={{ "--d": "0.18s" }}>
              <div className={styles.blockHead}>
                <span className={styles.mark} aria-hidden="true" />
                <span className={styles.no}>01</span>
                <h3 className={styles.h3}>場所</h3>
              </div>

              <div className={styles.rows}>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>エリア</span>
                  <span className={styles.rowText}>{ACCESS.area}</span>
                </div>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>住所</span>
                  <span className={styles.rowText}>{ACCESS.address}</span>
                </div>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>目印</span>
                  <span className={styles.rowText}>{ACCESS.landmark}</span>
                </div>
              </div>
            </div>

            {/* 02 */}
            <div className={`${styles.block} ${styles.reveal}`} style={{ "--d": "0.24s" }}>
              <div className={styles.blockHead}>
                <span className={styles.mark} aria-hidden="true" />
                <span className={styles.no}>02</span>
                <h3 className={styles.h3}>行き方</h3>
              </div>

              <div className={styles.routeList}>
                <div className={styles.route}>
                  <span className={styles.icon} aria-hidden="true">
                    <IconTrain className={styles.svg} />
                  </span>
                  <div className={styles.routeText}>
                    <div className={styles.routeTitle}>ゆいレールでお越しの方</div>
                    {yuiLines.map((t) => (
                      <div key={t} className={styles.routeLine}>{t}</div>
                    ))}
                  </div>
                </div>

                <div className={styles.route}>
                  <span className={styles.icon} aria-hidden="true">
                    <IconTaxi className={styles.svg} />
                  </span>
                  <div className={styles.routeText}>
                    <div className={styles.routeTitle}>タクシーでお越しの方</div>
                    <div className={styles.routeLine}>{ACCESS.taxi}</div>
                  </div>
                </div>

                <div className={styles.route}>
                  <span className={styles.icon} aria-hidden="true">
                    <IconParking className={styles.svg} />
                  </span>
                  <div className={styles.routeText}>
                    <div className={styles.routeTitle}>お車でお越しの方</div>
                    <div className={styles.routeLine}>{ACCESS.car}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ 03 ご連絡先ブロックは削除（Reserveに集約） */}
          </div>

          {/* ✅ “詰まった時の逃げ道”だけ残す（1行） */}
          <p className={`${styles.help} ${styles.reveal}`} style={{ "--d": "0.32s" }}>
            連絡は「予約」からでOKです。
          </p>
        </div>

        {/* RIGHT MAP */}
        <div className={styles.right}>
          <div className={`${styles.mapStage} ${styles.reveal}`} style={{ "--d": "0.12s" }}>
            <img
              className={styles.mapImg}
              src={MAP_IMG}
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = "/access-map-fallback.png";
              }}
            />

            <a
              className={styles.mapCard}
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Mapで場所を開く"
            >
              <div className={styles.mapCardTop}>
                <span className={styles.mapKicker}>MAP</span>
                <span className={styles.mapRule} aria-hidden="true" />
              </div>

              <div className={styles.mapCardTitle}>KOKUSAI-DORI AREA</div>
              <div className={styles.mapCardSub}>{ACCESS.landmark}</div>

              <div className={styles.mapCardLink}>
                Google Mapで開く <span className={styles.arrow} aria-hidden="true">↗</span>
              </div>
            </a>
          </div>
        </div>

        {/* BOTTOM BAR（連絡枠を削って2枠+CTAに） */}
        <div className={`${styles.bottom} ${styles.reveal}`} style={{ "--d": "0.38s" }}>
          <div className={styles.bottomItem}>
            <span className={styles.bottomIcon} aria-hidden="true">
              <IconClock className={styles.svgSm} />
            </span>
            <div className={styles.bottomText}>
              <div className={styles.bottomLabel}>集合</div>
              <div className={styles.bottomStrong}>開始 10分前</div>
            </div>
          </div>

          <div className={styles.bottomItem}>
            <span className={styles.bottomIcon} aria-hidden="true">
              <IconTrain className={styles.svgSm} />
            </span>
            <div className={styles.bottomText}>
              <div className={styles.bottomLabel}>最寄り</div>
              <div className={styles.bottomStrong}>美栄橋 5分 / 牧志 6分</div>
            </div>
          </div>

          <a className={styles.cta} href="#reserve" aria-label="予約セクションへ">
            ご予約はこちら <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}