// src/sections/Costume.jsx
import styles from "./CostumeSp.module.css";
import { RevealText } from "../components/Reveal";

const COLORS = [
  {
    key: "beni",
    label: "BENI",
    jp: "紅",
    note: ["迷ったら、これ。", "昼も夜も映える。", "石畳との相性がいい。"],
  },
  {
    key: "ai",
    label: "AI",
    jp: "藍",
    note: ["派手にしたくない人へ。", "締まった色が、", "景色の中で浮かない。"],
  },
  {
    key: "kogane",
    label: "KOGANE",
    jp: "黄金",
    note: ["光を受けると変わる色。", "夕暮れと夜に、", "いちばん顔が出る。"],
  },
];

const INCLUDES = [
  "着付け・小物・草履",
  "簡易ヘア",
  "散策OK",
  "夜間対応あり（プランによる）",
];

export default function CostumeSp() {
  return (
    <section
      id="costume-sp"
      className={styles.section}
      aria-labelledby="costumeTitle"
    >
      <div className={styles.wrap}>
        <div className={styles.rail} aria-hidden="true" />

        <header className={styles.head}>
          <RevealText as="div" className={styles.kicker} d="0.02s">
            COSTUME
          </RevealText>

          <RevealText as="h2" id="costumeTitle" className={styles.title} d="0.08s">
            色は選べます。
          </RevealText>

          <RevealText as="p" className={styles.lead} d="0.12s">
            迷ったら紅。派手にしたくないなら藍。<br aria-hidden="true" />
            光で選ぶなら黄金。
          </RevealText>

          <RevealText as="div" className={styles.colorLine} d="0.16s">
            <span className={styles.cBeni}>紅</span>
            <span className={styles.sep}>/</span>
            <span className={styles.cAi}>藍</span>
            <span className={styles.sep}>/</span>
            <span className={styles.cKogane}>黄金</span>
          </RevealText>
        </header>

        <div className={styles.body}>
          <div aria-label="選べる色">
            <RevealText as="div" className={styles.colorsKicker} d="0.16s">
              3 COLORS
            </RevealText>

            <div className={styles.colors}>
              {COLORS.map((c, i) => (
                <div key={c.key} className={styles.color}>
                  <div
                    className={styles.swatch}
                    data-tone={c.key}
                    data-label={c.label}
                    aria-hidden="true"
                  />
                  <div className={styles.colorMeta}>
                    <RevealText
                      as="div"
                      className={styles.colorLabel}
                      d={`${0.18 + i * 0.06}s`}
                    >
                      {c.label}
                    </RevealText>

                    <RevealText
                      as="div"
                      className={styles.colorJp}
                      d={`${0.22 + i * 0.06}s`}
                    >
                      {c.jp}
                    </RevealText>

                    <RevealText
                      as="div"
                      className={styles.colorNote}
                      d={`${0.26 + i * 0.06}s`}
                    >
                      {c.note.map((t, idx) => (
                        <span key={idx} className={styles.noteLine}>
                          {t}
                        </span>
                      ))}
                    </RevealText>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.proof}>
            <RevealText as="h3" className={styles.subhead} d="0.34s">
              含まれるもの
            </RevealText>

            <RevealText as="p" className={styles.includesSummary} d="0.36s">
              着付け・小物・草履・簡易ヘア込み
            </RevealText>

            <ul className={styles.includes}>
              {INCLUDES.map((t, i) => (
                <li key={t} className={styles.includeItem}>
                  <RevealText
                    as="div"
                    className={styles.includeText}
                    d={`${0.38 + i * 0.05}s`}
                  >
                    {t}
                  </RevealText>
                </li>
              ))}
            </ul>

            <div className={styles.miniGuide}>
              <RevealText as="div" className={styles.guideLine} d="0.62s">
                目安：準備 40〜50分 / 返却 〜19:00
              </RevealText>
            </div>
          </div>
        </div>

        <div className={styles.bottomMark} aria-hidden="true">
          <div className={styles.smallCaps}>KOU RYUI</div>
          <div className={styles.beniCaps}>COSTUME GUIDE</div>
        </div>
      </div>
    </section>
  );
}