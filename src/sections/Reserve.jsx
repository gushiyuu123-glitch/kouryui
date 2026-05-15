import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Reserve.module.css";

const QUICK = {
  soon: "最短のご案内：明日 13:00〜（目安）",
  reply: "返信目安：当日〜24h",
};

const TEL = "098-XXX-XXXX"; // 後で差し替え
const HOURS = "10:00–18:00";

const PLANS = [
  { id: "beni", label: "紅歩きプラン" },
  { id: "kokusai", label: "国際通りプラン" },
  { id: "yoru", label: "夜紅プラン" },
];

const TIME_BANDS = [
  { id: "morning", label: "朝" },
  { id: "noon", label: "昼" },
  { id: "sunset", label: "夕方" },
  { id: "night", label: "夜" },
];

export default function Reserve() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  const [openGuide, setOpenGuide] = useState(false);
  const [sent, setSent] = useState(false);

  const initial = useMemo(
    () => ({
      plan: "beni",
      date1: "",
      date2: "",
      band: "noon",
      timeFree: "",
      people: "2",
      contact: "line",
      contactValue: "",
      note: "",
    }),
    []
  );

  const [form, setForm] = useState(initial);

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

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    // デモ：実送信は後で繋ぐ
    // console.log(form);
  };

  return (
    <section
      ref={sectionRef}
      id="reserve"
      className={styles.section}
      aria-labelledby="reserve-label"
    >
      <div className={styles.wrap}>
        {/* TOP CENTER HEADER */}
        <header className={styles.head} ref={triggerRef}>
          <div
            className={`${styles.kicker} ${styles.reveal}`}
            style={{ "--d": "0.00s" }}
          >
            RESERVE
          </div>

          <h2
            id="reserve-label"
            className={`${styles.title} ${styles.reveal}`}
            style={{ "--d": "0.06s" }}
          >
            ご予約
          </h2>

          <p
            className={`${styles.sub} ${styles.reveal}`}
            style={{ "--d": "0.12s" }}
          >
            希望だけ送ってください。あとはこちらで整えます。
          </p>

          {/* 小さな後押し（ここが効く） */}
          <div
            className={`${styles.microRow} ${styles.reveal}`}
            style={{ "--d": "0.18s" }}
          >
            <span className={styles.micro}>{QUICK.soon}</span>
            <span className={styles.sep} aria-hidden="true">
              /
            </span>
            <span className={styles.micro}>{QUICK.reply}</span>

            <span className={styles.microLinks}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => setOpenGuide((v) => !v)}
                aria-expanded={openGuide}
                aria-controls="reserve-guide"
              >
                最短の目安 ↘
              </button>
              <a className={styles.linkA} href={`tel:${TEL}`}>
                電話で予約 ↗
              </a>
            </span>
          </div>

          {/* ドロワー（予約システムに見せない：3行固定） */}
          <div
            id="reserve-guide"
            className={`${styles.drawer} ${openGuide ? styles.open : ""}`}
            aria-hidden={!openGuide}
          >
            <div className={styles.drawerInner}>
              <div className={styles.drawerLine}>
                <span className={styles.drawerKey}>最短</span>
                <span className={styles.drawerVal}>明日 13:00〜（目安）</span>
              </div>
              <div className={styles.drawerLine}>
                <span className={styles.drawerKey}>混みやすい</span>
                <span className={styles.drawerVal}>土日 夕方</span>
              </div>
              <div className={styles.drawerLine}>
                <span className={styles.drawerKey}>確定</span>
                <span className={styles.drawerVal}>返信でご案内します</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className={styles.main}>
          {/* LEFT：後押し（感情→安心） */}
          <div className={styles.left}>
            <div
              className={`${styles.statement} ${styles.reveal}`}
              style={{ "--d": "0.26s" }}
            >
              <p className={styles.poem}>
                紅を選ぶ。
                <br />
                日時を決める。
                <br />
                あとは那覇で着るだけです。
              </p>

              <p className={styles.note}>
                迷ったまま送って大丈夫です。
                <br />
                返信で、当日の動きまで整えます。
              </p>
            </div>

            <div
              className={`${styles.facts} ${styles.reveal}`}
              style={{ "--d": "0.32s" }}
            >
              <div className={styles.fact}>
                <div className={styles.factLabel}>持ち物</div>
                <div className={styles.factStrong}>手ぶらOK</div>
              </div>
              <div className={styles.fact}>
                <div className={styles.factLabel}>所要</div>
                <div className={styles.factStrong}>着付け 20〜30分</div>
              </div>
              <div className={styles.fact}>
                <div className={styles.factLabel}>返却</div>
                <div className={styles.factStrong}>〜19:00 / 夜紅 〜21:00</div>
              </div>
            </div>

            <div
              className={`${styles.support} ${styles.reveal}`}
              style={{ "--d": "0.38s" }}
            >
              <div className={styles.supportRow}>
                <span className={styles.supportKey}>TEL</span>
                <a className={styles.supportVal} href={`tel:${TEL}`}>
                  {TEL} <span className={styles.supportSmall}>（{HOURS}）</span>
                </a>
              </div>
              <div className={styles.supportRow}>
                <span className={styles.supportKey}>ひとこと</span>
                <span className={styles.supportVal}>
                  「雨が心配」「道が不安」だけでも書けばOK。
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT：申込書（罫線で作る） */}
          <div className={styles.right}>
            <form className={styles.form} onSubmit={onSubmit}>
              <div
                className={`${styles.formHead} ${styles.reveal}`}
                style={{ "--d": "0.26s" }}
              >
                <div className={styles.formKicker}>RESERVATION REQUEST</div>
                <div className={styles.formSub}>
                  予約の確定は返信でご案内します。
                </div>
              </div>

              <fieldset
                className={`${styles.fieldset} ${styles.reveal}`}
                style={{ "--d": "0.32s" }}
              >
                <legend className={styles.legend}>プラン</legend>
                <div className={styles.choices}>
                  {PLANS.map((p) => (
                    <label key={p.id} className={styles.choice}>
                      <input
                        type="radio"
                        name="plan"
                        value={p.id}
                        checked={form.plan === p.id}
                        onChange={onChange("plan")}
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div
                className={`${styles.row2} ${styles.reveal}`}
                style={{ "--d": "0.36s" }}
              >
                <div className={styles.lineField}>
                  <label className={styles.label}>第1希望日</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={form.date1}
                    onChange={onChange("date1")}
                    required
                  />
                </div>

                <div className={styles.lineField}>
                  <label className={styles.label}>第2希望日</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={form.date2}
                    onChange={onChange("date2")}
                  />
                </div>
              </div>

              <div
                className={`${styles.row2} ${styles.reveal}`}
                style={{ "--d": "0.40s" }}
              >
                <div className={styles.lineField}>
                  <label className={styles.label}>希望時間帯</label>
                  <select
                    className={styles.select}
                    value={form.band}
                    onChange={onChange("band")}
                  >
                    {TIME_BANDS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.lineField}>
                  <label className={styles.label}>時間の希望（任意）</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="例：13:00〜 / 夕方早め など"
                    value={form.timeFree}
                    onChange={onChange("timeFree")}
                  />
                </div>
              </div>

              <div
                className={`${styles.row2} ${styles.reveal}`}
                style={{ "--d": "0.44s" }}
              >
                <div className={styles.lineField}>
                  <label className={styles.label}>人数</label>
                  <select
                    className={styles.select}
                    value={form.people}
                    onChange={onChange("people")}
                  >
                    <option value="1">1名</option>
                    <option value="2">2名</option>
                    <option value="3">3名</option>
                    <option value="4">4名</option>
                    <option value="consult">相談</option>
                  </select>
                </div>

                <div className={styles.lineField}>
                  <label className={styles.label}>連絡方法</label>
                  <select
                    className={styles.select}
                    value={form.contact}
                    onChange={onChange("contact")}
                  >
                    <option value="line">LINE</option>
                    <option value="tel">電話</option>
                    <option value="mail">メール</option>
                  </select>
                </div>
              </div>

              <div
                className={`${styles.lineField} ${styles.reveal}`}
                style={{ "--d": "0.48s" }}
              >
                <label className={styles.label}>連絡先（ID/番号/メール）</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="例：@xxxxx / 090-xxxx-xxxx / mail@example.com"
                  value={form.contactValue}
                  onChange={onChange("contactValue")}
                  required
                />
              </div>

              <div
                className={`${styles.lineField} ${styles.reveal}`}
                style={{ "--d": "0.52s" }}
              >
                <label className={styles.label}>ひとこと（任意）</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="例：雨が心配 / 道が不安 / 写真多め希望 など"
                  value={form.note}
                  onChange={onChange("note")}
                />
              </div>

              <div
                className={`${styles.actions} ${styles.reveal}`}
                style={{ "--d": "0.58s" }}
              >
                <button type="submit" className={styles.seal}>
                  <span className={styles.sealInk} aria-hidden="true" />
                  <span className={styles.sealText}>予約リクエストを送る</span>
                  <span className={styles.sealArrow} aria-hidden="true">
                    →
                  </span>
                </button>

                <div className={styles.actionMeta}>
                  <div className={styles.actionSmall}>{QUICK.reply}</div>
                  <div className={styles.actionTiny}>
                    ※確定は返信でご案内します（デモ）
                  </div>
                </div>
              </div>

              {sent ? (
                <div className={styles.sent} role="status">
                  送信しました（デモ）。返信で確定をご案内します。
                </div>
              ) : null}
            </form>
          </div>
        </div>

        {/* FOOTER STRIP（静かに締める） */}
        <div
          className={`${styles.footerLine} ${styles.reveal}`}
          style={{ "--d": "0.64s" }}
        >
          不安なことがあれば、予約時に一言だけ書いてください。
        </div>
      </div>
    </section>
  );
}