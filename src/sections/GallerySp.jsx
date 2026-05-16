import { useLayoutEffect, useRef } from "react";
import styles from "./GallerySp.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* register once (HMRでも上品) */
let _stReady = false;
if (typeof window !== "undefined" && !_stReady) {
  gsap.registerPlugin(ScrollTrigger);
  _stReady = true;
}

const SHOTS = [
  {
    id: "a",
    no: "01",
    time: "DAY",
    tone: "beni",
    title: "昼は、光がいちばん素直。",
    note: "やわらかい光 / 散策向け",
    src: "/plan-01.png",
    alt: "昼の石畳。紅の衣が光に映える。",
  },
  {
    id: "b",
    no: "02",
    time: "DUSK",
    tone: "kogane",
    title: "夕暮れは、色が深くなる。",
    note: "一番選ばれている時間帯 / 影が締まる",
    src: "/plan-02.png",
    alt: "夕方の国際通り。衣の色が深く見える。",
  },
  {
    id: "c",
    no: "03",
    time: "NIGHT",
    tone: "ai",
    title: "灯りで、輪郭が出る。",
    note: "夜間対応 / 灯りの時間",
    src: "/plan-03.png",
    alt: "夜の灯り。衣の輪郭が立つ。",
  },
];

const prefersReduce = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

export default function GallerySp() {
  const stageRef = useRef(null);
  const headRef = useRef(null);
  const panelsRef = useRef([]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduce = prefersReduce();
    const panels = panelsRef.current.filter(Boolean);

    const head = headRef.current;
    const hk = head?.querySelector("[data-kicker]");
    const ht = head?.querySelector("[data-title]");
    const hb = head?.querySelector("[data-beni]");
    const hl = head?.querySelector("[data-lead]");
    const hh = head?.querySelector("[data-hair]");

    const ctx = gsap.context(() => {
      // init panels
      panels.forEach((el) => {
        const mask = el.querySelector("[data-mask]");
        const img = el.querySelector("img");
        const cap = el.querySelector("[data-cap]");
        if (!mask || !img || !cap) return;

        gsap.set(mask, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.set(img, { scale: 1.08, y: -10, transformOrigin: "50% 35%" });
        gsap.set(cap, { opacity: 0, y: 10 });
      });

      // init header
      if (hk && ht && hb && hl && hh) {
        gsap.set(hk, { opacity: 0, y: 10 });
        gsap.set(ht, { opacity: 1, y: 14, clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(hb, {
          opacity: 0,
          y: 8,
          scale: 0.985,
          transformOrigin: "50% 80%",
        });
        gsap.set(hl, { opacity: 0, y: 10 });
        gsap.set(hh, { opacity: 0, scaleX: 0, transformOrigin: "0% 50%" });
      }

      // reduced motion
      if (reduce) {
        panels.forEach((el) => {
          const mask = el.querySelector("[data-mask]");
          const img = el.querySelector("img");
          const cap = el.querySelector("[data-cap]");
          if (!mask || !img || !cap) return;

          gsap.set(mask, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(el, { opacity: 1, y: 0 });
          gsap.set(img, { scale: 1.02, y: 0 });
          gsap.set(cap, { opacity: 1, y: 0 });
        });

        if (hk && ht && hb && hl && hh) {
          gsap.set(hk, { opacity: 1, y: 0 });
          gsap.set(ht, { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(hb, { opacity: 1, y: 0, scale: 1 });
          gsap.set(hl, { opacity: 1, y: 0 });
          gsap.set(hh, { opacity: 1, scaleX: 1 });
        }
        return;
      }

      // ============================
      // header：stageで一回だけ刻印
      // ============================
      const headerTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: stage,
          start: "top 76%",
          once: true,
        },
      });

      if (hk && ht && hb && hl && hh) {
        headerTl.to(hk, { opacity: 1, y: 0, duration: 0.34 }, 0.00);
        headerTl.to(
          ht,
          { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.86 },
          0.06
        );
        headerTl.to(hb, { opacity: 1, y: 0, scale: 1, duration: 0.40 }, 0.30);
        headerTl.to(hl, { opacity: 1, y: 0, duration: 0.42 }, 0.44);
        headerTl.to(
          hh,
          { opacity: 1, scaleX: 1, duration: 0.78, ease: "power2.out" },
          0.56
        );
      }

      // ==========================================
      // panels：各パネルが見えた瞬間に“像が整う”
      // ==========================================
      const panelTls = [];

      panels.forEach((el, idx) => {
        const mask = el.querySelector("[data-mask]");
        const img = el.querySelector("img");
        const cap = el.querySelector("[data-cap]");
        if (!mask || !img || !cap) return;

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        });

        // “均し”じゃなく紙面の呼吸として微差だけ残す
        const lead = 0.02 + idx * 0.02;

        tl.to(el, { opacity: 1, y: 0, duration: 0.38 }, lead);
        tl.to(mask, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.88 }, lead + 0.02);
        tl.to(img, { scale: 1.02, y: 0, duration: 1.06 }, lead);
        tl.to(cap, { opacity: 1, y: 0, duration: 0.44 }, lead + 0.26);

        panelTls.push(tl);
      });

      // cleanup（ctx.revertでも消えるが、ScrollTriggerは明示して品良く）
      return () => {
        headerTl.scrollTrigger?.kill();
        headerTl.kill();

        panelTls.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery-sp" className={styles.section} aria-labelledby="galleryTitle">
      <div className={styles.wrap}>
        <div ref={stageRef} className={styles.stage}>
          <header ref={headRef} className={styles.head}>
            <div className={styles.kicker} data-kicker>
              GALLERY
            </div>

            <h2 className={styles.title} id="galleryTitle" data-title>
              琉装の<span className={styles.beni} data-beni>三景</span>
            </h2>

            <p className={styles.lead} data-lead>
              <span className={styles.tBeni}>昼</span>
              <span className={styles.sep}> / </span>
              <span className={styles.tKogane}>夕暮れ</span>
              <span className={styles.sep}> / </span>
              <span className={styles.tAi}>夜</span>
            </p>

            <div className={styles.hair} data-hair aria-hidden="true" />
          </header>

          <div className={styles.panels}>
            {SHOTS.map((s, i) => (
              <figure
                key={s.id}
                ref={(el) => (panelsRef.current[i] = el)}
                className={styles.panel}
                data-pos={s.id}
                data-tone={s.tone}
              >
                <div className={styles.mask} data-mask>
                  <img
                    className={styles.img}
                    src={s.src}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <figcaption className={styles.cap} data-cap>
                  <div className={styles.capTop}>
                    <span className={styles.capNo}>{s.no}</span>
                    <span
                      className={`${styles.capTime} ${styles.toneText} ${
                        styles[`tone_${s.tone}`]
                      }`}
                    >
                      {s.time}
                    </span>
                  </div>

                  <div className={styles.capTitle}>{s.title}</div>
                  <div className={styles.capNote}>{s.note}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}