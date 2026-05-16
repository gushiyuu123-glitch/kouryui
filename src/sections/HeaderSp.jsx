import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
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

/** Vow同様：復帰だけ必ず auto にする（global smooth の巻き込み防止） */
function forceScrollRestore(top) {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: 0, behavior: "auto" });
  root.style.scrollBehavior = prev;
}

export default function HeaderSp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState("");

  const menuButtonRef = useRef(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  /** ✅ menuOpen時の“元の位置” */
  const lockYRef = useRef(0);

  /** ✅ 閉じたあとにスクロールする予約（ロック解除後に実行） */
  const pendingScrollRef = useRef(null);

  /** ✅ リンククリック時はフォーカス戻しをしない（Vow同様） */
  const restoreFocusRef = useRef(false);

  const sectionIds = useMemo(
    () => navItems.map((i) => getIdFromHref(i.href)).filter(Boolean),
    []
  );

  const closeMenu = ({ restoreFocus = true } = {}) => {
    restoreFocusRef.current = restoreFocus;
    setMenuOpen(false);
  };

  const scheduleScroll = (top, href) => {
    restoreFocusRef.current = false; // リンククリックは戻さない
    pendingScrollRef.current = { top, href };
    setMenuOpen(false);
  };

  const scrollToHref = (event, href) => {
    const id = getIdFromHref(href);
    if (!id) return;

    event.preventDefault();

    const target = document.getElementById(id);
    const baseY = menuOpen ? lockYRef.current : window.scrollY;

    // 無いならURLだけ更新して閉じる
    if (!target) {
      window.history.pushState(null, "", href);
      closeMenu({ restoreFocus: false });
      return;
    }

    const navOffset = 18;
    const targetTop = target.getBoundingClientRect().top + baseY - navOffset;

    window.history.pushState(null, "", href);
    setActiveId(id);

    scheduleScroll(Math.max(0, targetTop), href);
  };

  /* -------------------------------------------------
     scroll / active
     ✅ menuOpen中は更新しない（Vow同様）
  ------------------------------------------------- */
  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      if (menuOpen) return;

      const y = window.scrollY;

      // KOUはHero長めでいいので少し深め
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

  /* -------------------------------------------------
     body lock（Vow同様：fixed + overflow hidden + 復帰auto）
  ------------------------------------------------- */
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    const original = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
    };

    if (menuOpen) {
      // ✅ 重要：開いた瞬間の値を使う（押下で先に入れてる）
      const y = lockYRef.current;

      body.style.position = "fixed";
      body.style.top = `-${y}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      html.style.overscrollBehavior = "none";

      return () => {
        body.style.position = original.position;
        body.style.top = original.top;
        body.style.left = original.left;
        body.style.right = original.right;
        body.style.width = original.width;
        body.style.overflow = original.overflow;
        body.style.overscrollBehavior = original.overscrollBehavior;
        html.style.overscrollBehavior = "";

        // ✅ 復帰だけauto固定（ぐるぐる防止）
        forceScrollRestore(lockYRef.current);
      };
    }

    return () => {};
  }, [menuOpen]);

  /* -------------------------------------------------
     menu close → 予約スクロール実行（ロック解除後）
     ✅ Vow同様：rAF二段 + setTimeoutで確定
  ------------------------------------------------- */
  useEffect(() => {
    if (menuOpen) return;

    // closeボタン等で閉じたときだけフォーカス戻す
    if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      requestAnimationFrame(() => menuButtonRef.current?.focus?.());
    }

    const pending = pendingScrollRef.current;
    if (!pending) return;

    pendingScrollRef.current = null;
    const behavior = prefersReducedMotion() ? "auto" : "smooth";

    const run = () => window.scrollTo({ top: pending.top, behavior });

    requestAnimationFrame(() => {
      requestAnimationFrame(run);
      window.setTimeout(run, 90);
    });
  }, [menuOpen]);

  /* -------------------------------------------------
     overlay clip origin（open時だけ）
  ------------------------------------------------- */
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
    const raf = requestAnimationFrame(setOrigin);
    window.addEventListener("resize", setOrigin);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setOrigin);
    };
  }, [menuOpen]);

  return (
    <>
      {/* 右下：朱印 */}
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
            // ✅ “押した瞬間”に固定（scrollYが揺れる前に確定）
            if (!menuOpen) lockYRef.current = window.scrollY;
            setMenuOpen((v) => !v);
          }}
        >
          <span className={styles.stampLabel}>{menuOpen ? "閉じる" : "目次"}</span>
          <span className={styles.stampSeal} aria-hidden="true">
            <img className={styles.stampSirusi} src={SIRUSI} alt="" />
          </span>
        </button>
      </div>

      {/* overlay */}
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
          onClick={() => closeMenu({ restoreFocus: true })}
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