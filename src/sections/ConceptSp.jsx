import { useEffect, useRef } from "react";
import styles from "./ConceptSp.module.css";

export default function ConceptSp() {
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
      { threshold: 0.01, rootMargin: "0px 0px -28% 0px" }
    );

    io.observe(trigger);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="concept-sp"
      className={styles.section}
      aria-labelledby="concept-label"
    >
      <div className={styles.wrap}>
        <div ref={triggerRef} className={styles.right}>
          {/* ---- LABEL ---- */}
          <h2
            className={`${styles.label} ${styles.reveal}`}
            id="concept-label"
            style={{ "--d": "0.00s" }}
          >
            <span className={styles.en}>CONCEPT</span>
            <span className={styles.jp}>旅の記念で終わらせない</span>
          </h2>

          {/* ---- STATEMENTS ---- */}
          <div className={styles.statements}>
            <p
              className={`${styles.line} ${styles.reveal}`}
              style={{ "--d": "0.06s" }}
            >
              <span className={styles.keep}>沖縄の"衣"を、</span>
              <br aria-hidden="true" />
              旅の記念で終わらせない。
            </p>

            <p
              className={`${styles.line} ${styles.indent} ${styles.reveal}`}
              style={{ "--d": "0.14s" }}
            >
              着た瞬間、
              <span className={styles.keep}>背筋</span>
              が変わる。
            </p>

            <p
              className={`${styles.line} ${styles.reveal}`}
              style={{ "--d": "0.22s" }}
            >
              <span className={styles.beni}>紅</span>は、写真より先に残る。
            </p>

            <p
              className={`${styles.line} ${styles.indent} ${styles.reveal}`}
              style={{ "--d": "0.30s" }}
            >
              迷うなら、<span className={styles.beni}>紅</span>で決める。
            </p>
          </div>

          {/* ---- BRIDGE ---- */}
          <p
            className={`${styles.bridge} ${styles.reveal}`}
            style={{ "--d": "0.42s" }}
          >
            選んだら、そのまま国際通りへ。
            <br aria-hidden="true" />
            着付け込み。手ぶらでいい。
          </p>
        </div>
      </div>
    </section>
  );
}