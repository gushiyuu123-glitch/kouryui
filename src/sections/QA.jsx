import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./QA.module.css";

const HERO_IMG_FALLBACK = "/flow-prepare.png";
const QA_HERO_IMG = "/qa-hero.png"; // なければ fallback が出る

const QA = [
  {
    no: "01",
    q: "当日予約できますか？",
    aTitle: "当日でも、空きがあればご案内できます。",
    aLines: [
      "空き状況は当日でも確認できます。",
      "迷うなら、希望時間を1〜2個だけ書いてください。",
      "返信で、いちばん成立する形に整えます。",
    ],
    notes: ["返却：標準 〜19:00 / 夜紅 〜21:00", "持ち物：手ぶらOK"],
  },
  {
    no: "02",
    q: "雨の日はどうなりますか？",
    aTitle: "雨でも営業しています。",
    aLines: [
      "歩く場所と過ごし方は、天候に合わせて当日一緒に決めます。",
      "荒天が心配なら、時間変更の相談もできます。",
      "予約時に「雨が心配」と一言添えると案内が速いです。",
    ],
    notes: ["返却：標準 〜19:00 / 夜紅 〜21:00", "持ち物：手ぶらOK"],
  },
  {
    no: "03",
    q: "着付けは苦しくないですか？",
    aTitle: "苦しくない範囲で調整します。",
    aLines: [
      "歩きやすさを優先して、締めすぎない形で整えます。",
      "鏡で確認してから、最後に微調整して出発できます。",
      "気になるところはその場で言ってください。すぐ直します。",
    ],
    notes: ["所要：着付け 20〜30分", "持ち物：手ぶらOK"],
  },
  {
    no: "04",
    q: "持ち物は本当に不要ですか？",
    aTitle: "基本、手ぶらでOKです。",
    aLines: [
      "衣装・草履・小物はすべて含まれています。",
      "財布とスマートフォンだけで出発できます。",
      "不安があれば、予約時に一言だけ書いてください。",
    ],
    notes: ["持ち物：手ぶらOK", "国際通りエリア（散策しやすい）"],
  },
  {
    no: "05",
    q: "返却が遅れそうなときは？",
    aTitle: "早めに連絡をもらえれば対応できます。",
    aLines: [
      "遅れそうな時点で、一言だけください。",
      "状況に合わせて、延長や返却の段取りを案内します。",
      "時間よりも「連絡があるか」が安心の条件です。",
    ],
    notes: ["返却：標準 〜19:00 / 夜紅 〜21:00", "延長：事前連絡で相談OK"],
  },
  {
    no: "06",
    q: "キャンセル・変更はいつまで？",
    aTitle: "変更は前日までが確実です。直前でもまず連絡してください。",
    aLines: [
      "空き状況次第で、時間変更や別日の案内ができます。",
      "無断キャンセルだけは避けてください。",
      "迷った段階で一言くれれば、それだけで調整しやすくなります。",
    ],
    notes: ["変更：前日までが安心", "不安があれば予約時に一言"],
  },
];

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

function IconBag(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 8h12l1 13H5L6 8Z" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M9 8V6.6C9 5.16 10.34 4 12 4s3 1.16 3 2.6V8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function QASection() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const tabRefs = useRef([]);

  const [active, setActive] = useState(1); // 02 を初期選択
  const activeItem = useMemo(() => QA[active] || QA[0], [active]);

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

  const focusTab = (nextIdx) => {
    const btn = tabRefs.current[nextIdx];
    if (btn) btn.focus();
  };

  const onTabKeyDown = (e, idx) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = (idx + 1) % QA.length;
      setActive(n);
      focusTab(n);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = (idx - 1 + QA.length) % QA.length;
      setActive(n);
      focusTab(n);
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
      focusTab(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      const n = QA.length - 1;
      setActive(n);
      focusTab(n);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="qa"
      className={styles.section}
      aria-labelledby="qa-label"
    >
      <div className={styles.wrap}>
        {/* TOP CENTER HEADER */}
        <header className={styles.head} ref={triggerRef}>
          <div className={`${styles.kicker} ${styles.reveal}`} style={{ "--d": "0.00s" }}>
            Q&amp;A
          </div>

          <h2 id="qa-label" className={`${styles.title} ${styles.reveal}`} style={{ "--d": "0.06s" }}>
            よくあるご質問
          </h2>

          <p className={`${styles.sub} ${styles.reveal}`} style={{ "--d": "0.12s" }}>
            予約前によくいただく質問を、先にまとめました。
          </p>
        </header>

        {/* LEFT：質問リスト（Tabs） */}
        <div className={styles.left}>
          <div className={styles.listShell}>
            <span className={styles.rail} aria-hidden="true" />

            <ul className={styles.list} role="tablist" aria-label="よくある質問一覧">
              {QA.map((item, idx) => {
                const isActive = idx === active;
                return (
                  <li key={item.no} className={styles.row}>
                    <button
                      ref={(el) => (tabRefs.current[idx] = el)}
                      id={`qa-tab-${item.no}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="qa-panel"
                      tabIndex={isActive ? 0 : -1}
                      className={`${styles.qBtn} ${isActive ? styles.active : ""} ${styles.reveal}`}
                      style={{ "--d": `${0.18 + idx * 0.06}s` }}
                      onClick={() => setActive(idx)}
                      onKeyDown={(e) => onTabKeyDown(e, idx)}
                    >
                      <span className={styles.no}>{item.no}</span>
                      <span className={styles.qText}>{item.q}</span>
                      <span className={styles.dot} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* RIGHT：回答 */}
        <div
          className={styles.right}
          role="tabpanel"
          id="qa-panel"
          aria-labelledby={`qa-tab-${activeItem.no}`}
          aria-live="polite"
        >
          <figure
            className={`${styles.hero} ${styles.reveal}`}
            style={{ "--d": "0.12s" }}
            aria-hidden="true"
          >
            <img
              className={styles.heroImg}
              src={QA_HERO_IMG}
              onError={(e) => {
                e.currentTarget.src = HERO_IMG_FALLBACK;
              }}
              alt=""
            />
          </figure>

          <div className={styles.answer}>
            <h3 className={`${styles.aQ} ${styles.reveal}`} style={{ "--d": "0.18s" }}>
              {activeItem.q}
            </h3>

            <div className={`${styles.rule} ${styles.reveal}`} style={{ "--d": "0.22s" }} aria-hidden="true" />

            <p className={`${styles.aLead} ${styles.reveal}`} style={{ "--d": "0.26s" }}>
              {activeItem.aTitle}
            </p>

            <div className={`${styles.aBody} ${styles.reveal}`} style={{ "--d": "0.30s" }}>
              {activeItem.aLines.map((t, i) => (
                <span key={i} className={styles.aLine}>
                  {t}
                </span>
              ))}
            </div>

            <div className={`${styles.noteBox} ${styles.reveal}`} style={{ "--d": "0.38s" }}>
              <div className={styles.noteRow}>
                <span className={styles.noteIcon} aria-hidden="true">
                  <IconClock className={styles.svg} />
                </span>
                <span className={styles.noteText}>{activeItem.notes[0]}</span>
              </div>
              <div className={styles.noteSep} aria-hidden="true" />
              <div className={styles.noteRow}>
                <span className={styles.noteIcon} aria-hidden="true">
                  <IconBag className={styles.svg} />
                </span>
                <span className={styles.noteText}>{activeItem.notes[1]}</span>
              </div>
            </div>

            <p className={`${styles.closing} ${styles.reveal}`} style={{ "--d": "0.46s" }}>
              不安があれば、予約時に一言ください。返信で整えます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}