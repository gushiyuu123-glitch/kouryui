import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Header.module.css";

const SIRUSI = "/sirusi.svg";

const navItems = [
  { jp: "プラン", href: "#plan" },
  { jp: "色と衣装", href: "#costume" },
  { jp: "写真", href: "#gallery" },     // ← ギャラリー撤去
  { jp: "当日の流れ", href: "#flow" },
  { jp: "ご質問", href: "#qa" },       // ← Q&A撤去
  { jp: "場所", href: "#access" },     // ← アクセス撤去
  { jp: "予約", href: "#reserve", cta: true },
];

function getIdFromHref(href) {
  return href?.startsWith("#") ? href.slice(1) : "";
}
function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState("");

  const menuButtonRef = useRef(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  const sectionIds = useMemo(
    () => navItems.map((i) => getIdFromHref(i.href)).filter(Boolean),
    []
  );

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus?.();
  };

  const scrollToHref = (event, href) => {
    const id = getIdFromHref(href);
    if (!id) return;

    event.preventDefault();

    const target = document.getElementById(id);

    setMenuOpen(false);
    setActiveId(id);

    if (!target) {
      window.history.pushState(null, "", href);
      return;
    }

    const navOffset = window.innerWidth < 760 ? 64 : 78;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - navOffset;

    window.history.pushState(null, "", href);

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    setMenuOpen(false);
    setActiveId("");
    window.history.pushState(null, "", "#top");

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  // ✅ rAF統合（再現性の核）
  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;

      const y = window.scrollY;
      const heroLine = window.innerHeight * 0.68;

      setScrolled(y > 18);
      setPastHero(y > heroLine);

      const sampleY = Math.min(window.innerHeight * 0.42, 420);
      let current = "";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const rect = section.getBoundingClientRect();

        if (rect.top <= sampleY && rect.bottom >= sampleY) {
          current = id;
          break;
        }
        if (rect.top < sampleY) current = id;
      }

      setActiveId(current);
    };

    const onTick = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onTick, { passive: true });
    window.addEventListener("resize", onTick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onTick);
      window.removeEventListener("resize", onTick);
    };
  }, [sectionIds]);

  // body lock
  useEffect(() => {
    const body = document.body;

    const originalOverflow = body.style.overflow;
    const originalPaddingRight = body.style.paddingRight;

    if (menuOpen) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;

      body.style.overflow = "hidden";
      if (sbw > 0) body.style.paddingRight = `${sbw}px`;

      const timer = window.setTimeout(() => {
        const firstLink = panelRef.current?.querySelector("a");
        firstLink?.focus?.();
      }, 220);

      return () => {
        window.clearTimeout(timer);
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      };
    }

    body.style.overflow = originalOverflow;
    body.style.paddingRight = originalPaddingRight;

    return () => {
      body.style.overflow = originalOverflow;
      body.style.paddingRight = originalPaddingRight;
    };
  }, [menuOpen]);

  // focus trap + Esc
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // ✅ clip origin sync（Vow核は残す）
  useEffect(() => {
    if (!menuOpen) return;

    const overlay = overlayRef.current;
    const btn = menuButtonRef.current;
    if (!overlay || !btn) return;

    const setOrigin = () => {
      const r = btn.getBoundingClientRect();
      overlay.style.setProperty("--clip-x", `${r.left + r.width / 2}px`);
      overlay.style.setProperty("--clip-y", `${r.top + r.height / 2}px`);
    };

    setOrigin();
    window.addEventListener("resize", setOrigin);
    return () => window.removeEventListener("resize", setOrigin);
  }, [menuOpen]);

  return (
    <>
      <header
        className={[
          styles.nav,
          scrolled ? styles.scrolled : "",
          pastHero ? styles.pastHero : "",
          menuOpen ? styles.menuOpen : "",
        ].join(" ")}
      >
        <a className={styles.brand} href="#top" aria-label="トップへ" onClick={scrollToTop}>
          <span className={styles.brandName}>KOU RYUI</span>
          <span className={styles.brandSub}>那覇・国際通り</span>
        </a>

        <button
          ref={menuButtonRef}
          className={[styles.menuButton, menuOpen ? styles.menuButtonOpen : ""].join(" ")}
          type="button"
          aria-label={menuOpen ? "目次を閉じる" : "目次を開く"}
          aria-expanded={menuOpen}
          aria-controls="global-menu-panel"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuLabel}>目次</span>
          <span className={styles.menuSealWrap} aria-hidden="true">
            <span className={styles.menuSeal} />
            <img className={styles.menuSirusi} src={SIRUSI} alt="" />
          </span>
        </button>
      </header>

      <div
        ref={overlayRef}
        className={[styles.overlay, menuOpen ? styles.overlayOpen : ""].join(" ")}
        aria-hidden={!menuOpen}
      >
        <button
          className={styles.overlayBackdrop}
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="閉じる"
          onClick={closeMenu}
        />

        {/* ✅ 追加：朱の“にじみ輪”（Vowとの差分） */}
        <div className={styles.bleed} aria-hidden="true" />

        <aside
          id="global-menu-panel"
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="目次"
        >
          <div className={styles.panelInk} aria-hidden="true" />
          <div className={styles.panelStamp} aria-hidden="true" />

          <div className={styles.panelInner}>
            <div className={styles.panelHead}>
              <p className={styles.panelKicker}>KOU RYUI</p>
              <p className={styles.panelLead}>琉球衣装レンタル（着付け込み）</p>

              <div className={styles.panelMeta}>
                <span>那覇・国際通りエリア</span>
                <span>手ぶらOK</span>
                <span>当日相談可</span>
              </div>
            </div>

            <nav className={styles.panelNav} aria-label="目次">
              {navItems.map((item, index) => {
                const id = getIdFromHref(item.href);
                const isActive = activeId === id;

                return (
                  <a
                    key={item.href}
                    className={[
                      styles.panelLink,
                      isActive ? styles.panelLinkActive : "",
                      item.cta ? styles.panelLinkCta : "",
                    ].join(" ")}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={(event) => scrollToHref(event, item.href)}
                    style={{ "--delay": `${0.10 + index * 0.04}s` }}
                  >
                    <span className={styles.panelIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.panelMain}>{item.jp}</span>
                  </a>
                );
              })}
            </nav>

            <div className={styles.panelFooter}>
              <p>迷ったまま送って大丈夫です。</p>
              <a
                href="#reserve"
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => scrollToHref(event, "#reserve")}
              >
                予約する
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}