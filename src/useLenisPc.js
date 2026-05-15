// src/useLenisPc.js
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let _stReady = false;

export default function useLenisPc(enabled) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;

    // ✅ 念のため：reduced-motion / タッチ寄りは切る
    if (reduce || coarse) return;

    if (!_stReady) {
      gsap.registerPlugin(ScrollTrigger);
      _stReady = true;
    }

    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false, // ← SPはやらない
      lerp: 0.085,        // ぬめり過ぎない上質
      wheelMultiplier: 0.95,
    });

    lenisRef.current = lenis;

    // ✅ GSAP ticker同期
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // ✅ ScrollTrigger同期（ズレ事故防止）
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    // ✅ #アンカーの瞬間ジャンプを防ぐ（PCのみ）
    const onDocClick = (e) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const a = e.target?.closest?.('a[href^="#"]');
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      if (a.hasAttribute("data-no-lenis")) return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.05,
        easing: (x) => 1 - Math.pow(1 - x, 3), // cubic out
      });
    };

    document.addEventListener("click", onDocClick, true);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onDocClick, true);

      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(raf);

      lenis.destroy();
      lenisRef.current = null;

      ScrollTrigger.refresh();
    };
  }, [enabled]);

  return lenisRef;
}