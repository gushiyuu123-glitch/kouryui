import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./FlowSp.module.css";

const STEPS = [
  {
    no: "01",
    title: "予約",
    lead: "プランと希望日時を送るだけ。",
    desc: ["人数と時間帯だけ決まっていればOK。", "変更は前日まで可能です。"],
    fine: "返信目安：当日〜24時間以内。",
    notes: ["不安があれば、予約時に一言だけ書けばOK。", "確定は返信でご案内します。"],
  },
  {
    no: "02",
    title: "来店",
    lead: "開始10分前に来店。",
    desc: ["受付 → サイズ確認 → 当日の動線だけ確認。", "荷物は最小でOK（手ぶらでも入れます）。"],
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

export default function FlowSp() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  // ✅ 画像の“パッ”対策：ロード完了に合わせてフェード
  const [proofLoaded, setProofLoaded] = useState(() => PROOFS.map(() => false));
  const markProofLoaded = (idx) => {
    setProofLoaded((prev) => {
      if (prev[idx]) return prev;
      const next = prev.slice();
      next[idx] = true;
      return next;
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    if (!section || !trigger) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    let raf1 = 0;
    let raf2 = 0;

    // ✅ 初期状態を一度“描画させてから”in付与（環境によってパッを防ぐ）
    const show = () => {
      if (section.classList.contains(styles.in)) return;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          section.classList.add(styles.in);
        });
      });
    };

    if (reduce || !("IntersectionObserver" in window)) {
      section.classList.add(styles.in);
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        io.disconnect();
      },
      { threshold: 0.01, rootMargin: "0px 0px -28% 0px" }
    );

    io.observe(trigger);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="flow"
      className={styles.section}
      aria-labelledby="flowTitle"
    >
      <div className={styles.wrap}>
        <div className={styles.rail} aria-hidden="true" />

        <header ref={triggerRef} className={styles.head}>
          <div
            className={`${styles.kicker} ${styles.reveal}`}
            style={{ "--d": "0.00s" }}
          >
            FLOW
          </div>

          <h2
            id="flowTitle"
            className={`${styles.title} ${styles.reveal}`}
            style={{ "--d": "0.06s" }}
          >
            当日の流れ
          </h2>

          <p
            className={`${styles.lead} ${styles.reveal}`}
            style={{ "--d": "0.12s" }}
          >
            迷いやすい部分だけ先に。
            <br aria-hidden="true" />
            準備は40〜50分。散策OK。返却は基本〜19:00（夜紅は〜21:00）。
          </p>

          <div
            className={`${styles.facts} ${styles.reveal}`}
            style={{ "--d": "0.18s" }}
            aria-label="要点"
          >
            <span>準備 40〜50分</span>
            <i className={styles.dot} aria-hidden="true" />
            <span>散策 OK</span>
            <i className={styles.dot} aria-hidden="true" />
            <span>返却 〜19:00</span>
          </div>
        </header>

        <ol className={styles.timeline} aria-label="当日のステップ">
          {STEPS.map((s, i) => {
            const base = 0.24 + i * 0.10;
            const isLast = s.no === "05";

            return (
              <li
                key={s.no}
                className={`${styles.step} ${styles.reveal}`}
                style={{ "--d": `${base}s` }}
              >
                <div className={styles.stepHead}>
                  <span className={styles.no} aria-hidden="true">
                    {s.no}
                  </span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                </div>

                <p className={styles.stepLead}>{s.lead}</p>

                <ul className={styles.desc}>
                  {s.desc.map((t) => (
                    <li key={t} className={styles.descItem}>
                      {t}
                    </li>
                  ))}
                </ul>

                <p className={`${styles.fine} ${isLast ? styles.fineStrong : ""}`}>
                  {s.fine}
                </p>

                <ul className={styles.notes} aria-label="補足">
                  {s.notes.map((t) => (
                    <li key={t} className={styles.noteItem}>
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        <div className={styles.proofs} aria-label="要点の写真">
          <div
            className={`${styles.proofsHead} ${styles.reveal}`}
            style={{ "--d": "0.82s" }}
          >
            <span className={styles.proofsEn}>SCENES</span>
            <span className={styles.proofsJp}>要点だけ、写真で。</span>
          </div>

          <div className={styles.proofGrid}>
            {PROOFS.map((p, i) => (
              <figure
                key={p.chapter}
                className={`${styles.proof} ${styles.reveal}`}
                style={{ "--d": `${0.88 + i * 0.08}s` }}
              >
                <div
                  className={styles.proofMedia}
                  data-loaded={proofLoaded[i] ? "true" : "false"}
                >
                  <img
                    className={styles.proofImg}
                    src={p.img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onLoad={() => markProofLoaded(i)}
                  />
                  <div className={styles.proofOverlay} aria-hidden="true">
                    <span className={styles.proofChap}>{p.chapter}</span>
                    <span className={styles.proofTitle}>{p.title}</span>
                  </div>
                </div>

                <figcaption className={styles.proofPoints}>
                  {p.points.map((t) => (
                    <span key={t} className={styles.proofPoint}>
                      {t}
                    </span>
                  ))}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className={styles.bottomMark} aria-hidden="true">
          <div className={styles.smallCaps}>KOU RYUI</div>
          <div className={styles.beniCaps}>FLOW GUIDE</div>
        </div>
      </div>
    </section>
  );
}