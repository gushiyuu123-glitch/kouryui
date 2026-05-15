// src/sections/PlanSp.jsx
import { useEffect, useRef } from "react";
import styles from "./PlanSp.module.css";
import { RevealText, RevealImage } from "../components/Reveal";

const PLANS = [
  {
    no: "01",
    en: "BENI WALK",
    jp: "紅歩きプラン",
    title: "昼は、光がいちばん素直。",
    poem: ["昼の石畳で、衣を着て歩く。", "光がいちばん素直に映る。", "初めてでも決めやすい。"],
    badge: "標準｜散策向け",
    price: "¥9,800~",
    duration: "所要：2時間前後（準備含む）",
    returnBy: "返却：〜19:00",
    img: "/plansp-011.png",
    alt: "昼の石畳の道で、紅の衣を着て歩く。",
    ratio: "24/9",
    start: "top 82%",
  },
  {
    no: "02",
    en: "KOKUSAI LINE",
    jp: "国際通りプラン",
    title: "夕暮れは、色が深くなる。",
    poem: ["日が傾くと、色が深くなる。", "影が出て、写真が締まる。", "選ばれている時間帯。"],
    badge: "夕暮れ枠｜選ばれている時間帯",
    price: "¥11,800~",
    duration: "所要：2時間前後（準備含む）",
    returnBy: "返却：〜19:00",
    img: "/plan-022.png",
    alt: "夕方の街で、衣の色が深く見える。",
    ratio: "21/10",
    start: "top 80%",
  },
  {
    no: "03",
    en: "NIGHT BENI",
    jp: "夜紅プラン",
    title: "灯りで、輪郭が出る。",
    poem: ["国際通りの灯りが輪郭を作る。", "昼とは別の顔が出る。", "夜が好きな人へ。"],
    badge: "夜間対応｜灯りの時間",
    price: "¥13,800~",
    duration: "所要：2時間前後（準備含む）",
    returnBy: "返却：〜21:00",
    img: "/plan-033.png",
    alt: "夜の灯りの中で、衣の輪郭が立つ。",
    ratio: "22/10",
    start: "top 78%",
  },
];

export default function PlanSp() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const show = () => el.classList.add(styles.in);

    const stageWraps = Array.from(el.querySelectorAll(`.${styles.stageWrap}`));
    const stageObservers = [];

    const armStage = (node) => {
      const raw = node.dataset.ovStart || "top 82%";
      const m = raw.match(/top\s+(\d+)%/);
      const pct = m ? Number(m[1]) : 82;
      const cut = Math.max(0, Math.min(60, 100 - pct));
      const rootMargin = `0px 0px -${cut}% 0px`;

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          node.dataset.ov = "1";
          io.disconnect();
        },
        { threshold: 0, rootMargin }
      );

      io.observe(node);
      stageObservers.push(io);
    };

    if (reduce || !("IntersectionObserver" in window)) {
      show();
      stageWraps.forEach((n) => (n.dataset.ov = "1"));
      return () => {};
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        io.disconnect();
      },
      { threshold: 0.18, rootMargin: "-10% 0px -10% 0px" }
    );

    io.observe(el);
    stageWraps.forEach(armStage);

    return () => {
      io.disconnect();
      stageObservers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <section id="plan" className={styles.section} aria-labelledby="planTitleSp">
      <div ref={wrapRef} className={styles.wrap}>
        <header className={styles.head}>
          <RevealText as="div" className={styles.kicker} d="0.00s">
            PLAN
          </RevealText>

          <RevealText as="h2" id="planTitleSp" className={styles.title} d="0.08s">
            時間帯で、景色が変わる。
          </RevealText>

          <RevealText as="p" className={styles.note} d="0.16s">
            色はプランに関係なく選べます。{" "}

          </RevealText>
        </header>

        <ul className={styles.list}>
          {PLANS.map((p, i) => {
            const base = 0.10 + i * 0.10;

            return (
              <li key={p.no} className={styles.item}>
                <div className={styles.itemHead}>
                  <RevealText as="div" className={styles.no} d={`${base + 0.00}s`}>
                    {p.no}
                  </RevealText>

                  <div className={styles.names}>
                    <RevealText as="div" className={styles.en} d={`${base + 0.04}s`}>
                      {p.en}
                    </RevealText>
                    <RevealText as="div" className={styles.jp} d={`${base + 0.08}s`}>
                      {p.jp}
                    </RevealText>
                  </div>

                  <RevealText as="div" className={styles.badge} d={`${base + 0.12}s`}>
                    {p.badge}
                  </RevealText>
                </div>

                <RevealText as="p" className={styles.lead} d={`${base + 0.16}s`}>
                  {p.title}
                </RevealText>

                {/* ---- 画像（オーバーレイなし） ---- */}
                <div
                  className={styles.stageWrap}
                  data-ov-start={p.start}
                  style={{ "--ovDelay": `${base + 0.04}s` }}
                >
                  <RevealImage
                    className={styles.stage}
                    imgClassName={styles.img}
                    src={p.img}
                    alt={p.alt}
                    ratio={p.ratio}
                    d={`${base + 0.00}s`}
                    mode="io"
                    start={p.start}
                  />

                  {/* 上：署名（プラン名だけ。薄く） */}
                  <div className={styles.ovTop} aria-hidden="true">
                    <div className={styles.ovTopInner}>
                      <div className={styles.ovRule} />
                      <div className={styles.ovLabel}>PLAN</div>
                      <div className={styles.ovLine}>{p.en}</div>
                      <div className={styles.ovLineJp}>{p.jp}</div>
                    </div>
                  </div>

                  {/* 読み上げ保険 */}
                  <span className={styles.srOnly}>
                    {p.no} {p.en} {p.jp}。{p.badge}。料金 {p.price}。{p.duration}、{p.returnBy}。
                  </span>
                </div>

                {/* ---- 価格・時間は画像の外 ---- */}
                <RevealText as="div" className={styles.meta} d={`${base + 0.18}s`}>
                  <span className={styles.price}>{p.price}</span>
                  <span className={styles.metaDivider} aria-hidden="true" />
                  <span className={styles.duration}>{p.duration}</span>
                  <span className={styles.returnBy}>{p.returnBy}</span>
                </RevealText>

                <RevealText as="div" className={styles.poem} d={`${base + 0.22}s`}>
                  {p.poem.map((line, idx) => (
                    <span key={idx} className={styles.poemLine}>
                      {line}
                    </span>
                  ))}
                </RevealText>
              </li>
            );
          })}
        </ul>

        <div className={styles.bottomMark} aria-hidden="true">
          <div className={styles.smallCaps}>KIMONO RENTAL NAHA</div>
          <div className={styles.beniCaps}>TIME EDITION</div>
        </div>
      </div>
    </section>
  );
}