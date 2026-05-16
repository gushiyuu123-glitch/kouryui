import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./HeaderSp.module.css";

const SIRUSI = "/sirusi.svg";

const navItems = [
  { jp: "プラン", href: "#plan" },
  { jp: "色と衣装", href: "#costume" },
  { jp: "着姿", href: "#gallery" },
  { jp: "当日の流れ", href: "#flow" },
  { jp: "ご質問", href: "#qa" },
  { jp: "場所と行き方", href: "#access" },
  { jp: "予約", href: "#reserve", cta: true },
];

function getIdFromHref(href) {
  return href?.startsWith("#") ? href.slice(1) : "";
}
function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

export default function HeaderSp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState("");

  const menuButtonRef = useRef(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  // ✅ 開く瞬間の scrollY を“即”保存（ここが最重要）
  const openScrollYRef = useRef(0);

  // ✅ 閉じた後に走らせるスクロール
  const pendingScrollRef = useRef(null);

  const sectionIds = useMemo(
    () => navItems.map((i) => getIdFromHref(i.href)).filter(Boolean),
    []
  );

  const closeMenu = () => {
    pendingScrollRef.current = null;
    setMenuOpen(false);
  };

  const scrollToHref = (event, href) => {
    const id = getIdFromHref(href);
    if (!id) return;

    event.preventDefault();

    const target = document.getElementById(id);
    setActiveId(id);

    window.history.pushState(null, "", href);

    if (!target) {
      setMenuOpen(false);
      return;
    }

    const navOffset = 18;
    const baseY = menuOpen ? openScrollYRef.current : window.scrollY;
    const targetTop = target.getBoundingClientRect().top + baseY - navOffset;

    pendingScrollRef.current = {
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    };

    setMenuOpen(false);
  };

  // pastHero + active（既存のまま）
  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;

      const y = window.scrollY;
      const heroLine = window.innerHeight * 0.72;
      setPastHero(y > heroLine);

      const sampleY = Math.min(window.innerHeight * 0.46, 460);
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

  // ✅ body lock（useLayoutEffectで“描画前”に固定）
  useLayoutEffect(() => {
    if (!menuOpen) return;

    const body = document.body;
    const html = document.documentElement;

    // ✅ ここで window.scrollY を読むのをやめる（0拾いの温床）
    const scrollY = openScrollYRef.current;

    const sbw = window.innerWidth - document.documentElement.clientWidth;

    const original = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflowY: body.style.overflowY,
      paddingRight: body.style.paddingRight,
      scrollBehavior: html.style.scrollBehavior,
    };

    // ✅ smoothが噛んでると復元が変に見えるので一旦殺す
    html.style.scrollBehavior = "auto";

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflowY = "scroll";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    return () => {
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.width = original.width;
      body.style.overflowY = original.overflowY;
      body.style.paddingRight = original.paddingRight;
      html.style.scrollBehavior = original.scrollBehavior;

      // ✅ まず“元の位置”へ戻す（保存値で）
      window.scrollTo({ top: scrollY, behavior: "auto" });

      // ✅ pendingがあれば、その後に狙い位置へ
      const pending = pendingScrollRef.current;
      pendingScrollRef.current = null;
      if (pending) window.scrollTo(pending);
    };
  }, [menuOpen]);

  // clip origin sync
  useLayoutEffect(() => {
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
      <div
        className={[
          styles.fab,
          pastHero ? styles.fabIn : "",
          menuOpen ? styles.fabOpen : "",
        ].join(" ")}
        aria-hidden={!pastHero && !menuOpen}
      >
        <button
          ref={menuButtonRef}
          className={[
            styles.stampButton,
            menuOpen ? styles.stampButtonOpen : "",
          ].join(" ")}
          type="button"
          aria-label={menuOpen ? "目次を閉じる" : "目次を開く"}
          aria-expanded={menuOpen}
          aria-controls="global-menu-panel"
          onClick={() => {
            if (!menuOpen) openScrollYRef.current = window.scrollY; // ✅ここで確定
            setMenuOpen((v) => !v);
          }}
        >
          <span className={styles.stampLabel}>{menuOpen ? "閉じる" : "目次"}</span>
          <span className={styles.stampSeal} aria-hidden="true">
            <img className={styles.stampSirusi} src={SIRUSI} alt="" />
          </span>
        </button>
      </div>

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
          <div className={styles.panelInner}>
            <header className={styles.panelHead}>
              <p className={styles.panelKicker}>KOU RYUI</p>
              <p className={styles.panelLead}>琉球衣装レンタル（着付け込み）</p>
              <div className={styles.panelMeta}>
                <span>那覇・国際通りエリア</span>
                <span>手ぶらOK</span>
                <span>当日相談可</span>
              </div>
            </header>

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

            <footer className={styles.panelFooter}>
              <p>迷ったまま送って大丈夫です。</p>
              <a
                href="#reserve"
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => scrollToHref(event, "#reserve")}
              >
                予約する
              </a>
            </footer>
          </div>
        </aside>
      </div>
    </>
  );
}