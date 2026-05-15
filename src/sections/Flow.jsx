// src/sections/Flow.jsx
import { useEffect, useRef } from "react";
import styles from "./Flow.module.css";

const STEPS = [
  {
    no: "01",
    title: "予約",
    lead: "プランと希望日時を送るだけ。",
    desc: [
      "人数と時間帯だけ決まっていればOK。",
      "変更は前日まで可能です。",
    ],
    fine: "返信目安：当日〜24時間以内。",
    notes: [
      "不安があれば、予約時に一言だけ書けばOK。",
      "確定は返信でご案内します。",
    ],
  },
  {
    no: "02",
    title: "来店",
    lead: "開始10分前に来店。",
    desc: [
      "受付 → サイズ確認 → 当日の動線だけ確認。",
      "荷物は最小でOK（手ぶらでも入れます）。",
    ],
    fine: "準備が整うと、散策の時間が増えます。",
    notes: ["歩きやすさ優先で合わせます。", "歩く場所は当日一緒に決められます。"],
  },
  {
    no: "03",
    title: "着付け",
    lead: "所要20〜30分。",
    desc: ["苦しくない範囲で調整します。", "鏡で確認して、最後に微調整して出発。"],
    fine: "見た目より“一日歩ける”を優先します。",
    notes: ["きついと感じたらその場で言ってください。", "歩き方のコツも一言だけ伝えます。"],
  },
  {
    no: "04",
    title: "散策",
    lead: "着付け後はそのまま国際通りへ。",
    desc: ["写真も散策も自由です。", "歩く場所だけ決めて、あとは気分でOK。"],
    fine: "雨の日は、歩く場所と撮り方を当日一緒に決めます。",
    notes: ["荒天が心配なら、時間変更の相談もできます。", "疲れたら戻って休憩もできます。"],
  },
  {
    no: "05",
    title: "返却",
    lead: "標準 〜19:00 / 夜紅 〜21:00。",
    desc: ["返却は来店時と同じ場所です。", "遅れそうな時は、早めに一言ください。"],
    fine: "脱いだら終わりです。",
    notes: ["延長も事前連絡で相談できます。", "時間の調整が必要なら、早めに伝えてください。"],
  },
];

const PROOFS = [
  {
    chapter: "PREP",
    title: "準備",
    img: "/flow-prepare.png",
    points: ["手ぶらOK", "衣装一式 + 草履", "国際通りエリア"],
  },
  {
    chapter: "DAY",
    title: "当日",
    img: "/flow-dressing.png",
    points: ["着付け 20〜30分", "苦しくない範囲で調整", "返却 〜19:00"],
  },
];

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
function IconReturn(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 12a8 8 0 1 1-3.1-6.3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M20 4v5h-5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Flow() {
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

  return (
    <section
      ref={sectionRef}
      id="flow"
      className={styles.section}
      aria-labelledby="flow-label"
    >
      <div className={styles.wrap}>
        {/* LEFT */}
        <div className={styles.left} ref={triggerRef}>
          <header className={styles.head}>
            <div
              className={`${styles.kicker} ${styles.reveal}`}
              style={{ "--d": "0.00s" }}
            >
              FLOW
            </div>

            <h2
              id="flow-label"
              className={`${styles.title} ${styles.reveal}`}
              style={{ "--d": "0.06s" }}
            >
              予約から返却まで
            </h2>

            <p
              className={`${styles.sub} ${styles.reveal}`}
              style={{ "--d": "0.12s" }}
            >
              当日の動きが、一発で分かるように。
            </p>

            <p
              className={`${styles.intro} ${styles.reveal}`}
              style={{ "--d": "0.18s" }}
            >
              初めてでも、動きが頭の中で再生できるようにまとめました。
              <br />
              必要なことだけ、短く置いています。
            </p>
          </header>

          <ol className={styles.timeline} aria-label="予約から返却までの流れ">
            {STEPS.map((s, i) => (
              <li
                key={s.no}
                className={`${styles.step} ${styles.reveal}`}
                style={{ "--d": `${0.26 + i * 0.08}s` }}
              >
                <span className={styles.dot} aria-hidden="true" />

                <div className={styles.stepBody}>
                  <div className={styles.stepTop}>
                    <span className={styles.no}>{s.no}</span>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                  </div>

                  <p className={styles.stepText}>
                    <span className={styles.leadLine}>{s.lead}</span>
                    {s.desc.map((line, idx) => (
                      <span key={idx} className={styles.line}>
                        {line}
                      </span>
                    ))}
                    <span className={styles.fine}>{s.fine}</span>
                  </p>

                  <ul className={styles.notes} aria-label={`${s.title}の補足`}>
                    {s.notes.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <div
            className={`${styles.metaRow} ${styles.reveal}`}
            style={{ "--d": "0.78s" }}
          >
            <div className={styles.metaItem}>
              <span className={styles.metaIcon} aria-hidden="true">
                <IconBag className={styles.svg} />
              </span>
              <div className={styles.metaText}>
                <div className={styles.metaLabel}>持ち物</div>
                <div className={styles.metaStrong}>手ぶらでOK</div>
                <div className={styles.metaSmall}>必要なものは一式揃っています。</div>
              </div>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaIcon} aria-hidden="true">
                <IconClock className={styles.svg} />
              </span>
              <div className={styles.metaText}>
                <div className={styles.metaLabel}>所要</div>
                <div className={styles.metaStrong}>着付け 20〜30分</div>
                <div className={styles.metaSmall}>受付後すぐにご案内できます。</div>
              </div>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaIcon} aria-hidden="true">
                <IconReturn className={styles.svg} />
              </span>
              <div className={styles.metaText}>
                <div className={styles.metaLabel}>返却</div>
                <div className={styles.metaStrong}>標準 〜19:00</div>
                <div className={styles.metaSmall}>夜紅 〜21:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT (Proof column) */}
        <div className={styles.right} aria-hidden="true">
          {PROOFS.map((p, i) => (
            <figure
              key={p.chapter}
              className={`${styles.proof} ${styles.reveal}`}
              style={{ "--d": `${0.12 + i * 0.14}s` }}
            >
              <img
                className={styles.proofImg}
                src={p.img}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className={styles.overlay}>
                <div className={styles.chapter}>{p.chapter}</div>
                <div className={styles.proofTitle}>{p.title}</div>
                <ul className={styles.points}>
                  {p.points.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className={styles.brand} aria-hidden="true">
        <span className={styles.brandLine} />
        <span className={styles.brandCore}>
          <span className={styles.brandMark}>✿</span>
          <span className={styles.brandName}>KOU RYUI</span>
          <span className={styles.brandSub}>OKINAWA KIMONO RENTAL</span>
        </span>
        <span className={styles.brandLine} />
      </div>
    </section>
  );
}