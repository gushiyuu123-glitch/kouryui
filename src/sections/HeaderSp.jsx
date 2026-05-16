import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeaderSp.module.css";

const SIRUSI = "/sirusi.svg";

/**
 * ✅ SPだけIDを分離（-sp）
 * ※ 各SPセクション側も id="plan-sp" みたいに合わせてね
 */
const navItems = [
  { jp: "プラン", href: "#plan-sp" },
  { jp: "色と衣装", href: "#costume-sp" },
  { jp: "着姿", href: "#gallery-sp" },
  { jp: "当日の流れ", href: "#flow-sp" },
  { jp: "ご質問", href: "#qa-sp" },
  { jp: "場所と行き方", href: "#access-sp" },
  { jp: "予約", href: "#reserve-sp", cta: true },
];

function getIdFromHref(href) {
  return href?.startsWith("#") ? href.slice(1) : "";
}
function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

/**
 * focus() が「要素を画面内に入れよう」としてスクロールを勝手に動かすことがある。
 * preventScroll を使い、効かない環境では “飛んだら戻す” で止める。
 */
function focusNoScroll(el) {
  if (!el) return;
  const y = window.scrollY;

  try {
    el.focus({ preventScroll: true });
  } catch {
    el.focus?.();
  }

  // preventScroll が効かない環境（主にモバイルSafari）対策
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

  const sectionIds = useMemo(
    () => navItems.map((i) => getIdFromHref(i.href)).filter(Boolean),
    []
  );

  /**
   * ✅ 追加（トップ吸い応急処置）
   * メニューを「開く瞬間」の現在地を凍結して、閉じたらそこへ戻す
   */
  const lockYRef = useRef(0);      // 開く瞬間のscrollY
  const lockIdRef = useRef("");    // 開く瞬間のactiveId
  const didNavigateRef = useRef(false); // 目次リンクで移動した時はワープしない

  const closeMenu = () => {
    didNavigateRef.current = false;
    setMenuOpen(false);

    // 閉じたら朱印へ戻す（スクロールは動かさない）
    requestAnimationFrame(() => focusNoScroll(menuButtonRef.current));
  };

  const scrollToHref = (event, href) => {
    const id = getIdFromHref(href);
    if (!id) return;

    event.preventDefault();

    const target = document.getElementById(id);

    // ✅ 目次リンクでの移動は「ワープ復帰」を無効化（目的地を優先）
    didNavigateRef.current = true;

    setMenuOpen(false);
    setActiveId(id);

    if (!target) {
      window.history.pushState(null, "", href);
      return;
    }

    // SPはバーが無いので浅めでOK（余白だけ残す）
    const navOffset = 18;

    // ✅ menuOpen中にscrollYが0化しても死なないように「開く瞬間のY」を使えるようにする
    const baseY = menuOpen ? lockYRef.current : window.scrollY;

    const targetTop =
      target.getBoundingClientRect().top + baseY - navOffset;

    window.history.pushState(null, "", href);

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  /**
   * ✅ 追加：トップ吸いしても閉じたら復帰（構造は崩さない）
   * 条件：
   * - 目次リンクでの移動ではない
   * - 閉じた直後に scrollY がほぼ0（=吸われてる）
   * - 開く前はそこそこ下（=復帰する意味がある）
   */
  useEffect(() => {
    if (menuOpen) return;

    // 目次リンクで移動した場合は復帰ワープしない
    if (didNavigateRef.current) {
      didNavigateRef.current = false;
      return;
    }

    const wasY = lockYRef.current;
    if (wasY < 24) return; // もともと上なら何もしない

    // “吸われてる” 判定（閉じた直後にほぼトップ）
    if (window.scrollY > 2) return;

    const navOffset = 18;
    const id = lockIdRef.current;

    const el = id ? document.getElementById(id) : null;

    // 基本は「元セクションへ」。取れなければY復帰。
    const top = el
      ? el.getBoundingClientRect().top + window.scrollY - navOffset
      : wasY;

    const t = Math.max(0, Math.round(top));

    // iOS向け：rAF＋短いタイマーで確定
    requestAnimationFrame(() => {
      window.scrollTo({ top: t, behavior: "auto" });
      window.setTimeout(() => {
        window.scrollTo({ top: t, behavior: "auto" });
      }, 80);
    });
  }, [menuOpen]);

  // rAF統合：Hero越え判定 + active検知
  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;

      const y = window.scrollY;
      const heroLine = window.innerHeight * 0.72; // SPは少し深め
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

  // body lock（いまの安定構造を維持）
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
        // 開いた瞬間に “勝手にトップへ飛ぶ” 主因になりがち（focusによるスクロール）
        // → ただし君の環境では「白化しない安定版」なので、構造維持のため残す
        focusNoScroll(firstLink);
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

  // clip origin sync（朱印ボタン中心から展開）
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
      {/* 右下：朱印（Hero中は出さない） */}
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
          aria-controls="global-menu-panel-sp"
          onClick={() => {
            // ✅ 開く瞬間に「現在地」を凍結（吸われる前に確定）
            if (!menuOpen) {
              lockYRef.current = window.scrollY;
              lockIdRef.current = activeId;
              didNavigateRef.current = false;
            }
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
          onClick={closeMenu}
        />

        {/* 朱のにじみ輪（別作品化ポイント） */}
        <div className={styles.bleed} aria-hidden="true" />

        <aside
          id="global-menu-panel-sp"
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
                href="#reserve-sp"
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => scrollToHref(event, "#reserve-sp")}
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