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
function isCoarsePointer() {
  return window.matchMedia?.("(pointer: coarse)")?.matches ?? true;
}

// ✅ 復帰だけ必ず auto（scroll-behavior:smooth の巻き込み防止）
function forceScrollRestore(top) {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: 0, behavior: "auto" });
  root.style.scrollBehavior = prev;
}

/**
 * focus() がスクロールを動かすことがある。
 * SPでは基本使わない（事故率が上がる）方針。
 */
function focusNoScroll(el) {
  if (!el) return;
  const y = window.scrollY;
  try {
    el.focus({ preventScroll: true });
  } catch {
    el.focus?.();
  }
  if (Math.abs(window.scrollY - y) > 2) {
    window.scrollTo({ top: y, behavior: "auto" });
  }
}

export default function HeaderSp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState("");

  const menuButtonRef = useRef(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  // ✅ 開く瞬間の“本当の位置”を固定（これがトップ吸い対策の核）
  const lockYRef = useRef(0);

  // ✅ 閉じた後にスクロール（ロック解除後に実行）
  const pendingScrollRef = useRef(null);

  const sectionIds = useMemo(
    () => navItems.map((i) => getIdFromHref(i.href)).filter(Boolean),
    []
  );

  const closeMenu = () => {
    setMenuOpen(false);

    // SPはフォーカス戻しを基本しない（勝手スクロールの種）
    if (!isCoarsePointer()) {
      requestAnimationFrame(() => focusNoScroll(menuButtonRef.current));
    }
  };

  const scrollToHref = (event, href) => {
    const id = getIdFromHref(href);
    if (!id) return;

    event.preventDefault();
    const target = document.getElementById(id);

    setActiveId(id);
    window.history.pushState(null, "", href);

    // ✅ 先に閉じる（移動はロック解除後）
    setMenuOpen(false);

    if (!target) return;

    const navOffset = 18;
    const baseY = menuOpen ? lockYRef.current : window.scrollY; // ✅ 0化対策
    const targetTop = target.getBoundingClientRect().top + baseY - navOffset;

    pendingScrollRef.current = {
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    };
  };

  // ✅ 「閉じた後」に pending scroll 実行（ロック解除後）
  useEffect(() => {
    if (menuOpen) return;
    const pending = pendingScrollRef.current;
    if (!pending) return;

    pendingScrollRef.current = null;

    // iOSは一回だと負けることがあるので二段で確定
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.scrollTo(pending));
      window.setTimeout(() => window.scrollTo(pending), 90);
    });
  }, [menuOpen]);

  // rAF統合：Hero越え判定 + active検知（menuOpen中は止める）
  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      if (menuOpen) return;

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
  }, [sectionIds, menuOpen]);

  /**
   * ✅ body lock（ここが本丸）
   * useEffectだと「1フレームだけ通常描画→その後ロック」でSafariが暴れる
   * useLayoutEffectで“描画前に”固定する
   */
  useLayoutEffect(() => {
    if (!menuOpen) return;

    const body = document.body;
    const html = document.documentElement;

    const y = lockYRef.current; // ✅ クリック瞬間の値
    const sbw = window.innerWidth - document.documentElement.clientWidth;

    const original = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      overscrollBehavior: body.style.overscrollBehavior,
    };

    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    html.style.overscrollBehavior = "none";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    return () => {
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.left = original.left;
      body.style.right = original.right;
      body.style.width = original.width;
      body.style.overflow = original.overflow;
      body.style.paddingRight = original.paddingRight;
      body.style.overscrollBehavior = original.overscrollBehavior;
      html.style.overscrollBehavior = "";

      // ✅ 必ず元位置へ復帰（ここがトップ吸い防止）
      forceScrollRestore(y);
    };
  }, [menuOpen]);

  // clip origin sync（朱印中心から展開）— ここもlayoutで先に決める
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
          onClick={() =>
            setMenuOpen((v) => {
              // ✅ “開く瞬間”に位置を固定
              if (!v) lockYRef.current = window.scrollY;
              return !v;
            })
          }
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