// src/App.jsx
import { useEffect, useState } from "react";

/* PC (existing: keep as-is) */
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import Concept from "./sections/Concept";
import Plan from "./sections/Plan";
import Costume from "./sections/Costume";
import Gallery from "./sections/Gallery";
import Flow from "./sections/Flow";
import QA from "./sections/QA";
import Access from "./sections/Access";
import Reserve from "./sections/Reserve";
import Footer from "./sections/Footer";

/* SP (new: empty for now) */
import HeaderSp from "./sections/HeaderSp";
import HeroSp from "./sections/HeroSp";
import ConceptSp from "./sections/ConceptSp";
import PlanSp from "./sections/PlanSp";
import CostumeSp from "./sections/CostumeSp";
import GallerySp from "./sections/GallerySp";
import FlowSp from "./sections/FlowSp";
import QASp from "./sections/QASp";
import AccessSp from "./sections/AccessSp";
import ReserveSp from "./sections/ReserveSp";
import FooterSp from "./sections/FooterSp";

const MQ_SP = "(max-width: 880px)";

/* hook: matchMedia */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.(query)?.matches ?? false;
  });

  useEffect(() => {
    const mql = window.matchMedia?.(query);
    if (!mql) return;

    const onChange = (e) => setMatches(e.matches);

    // 初期同期
    setMatches(mql.matches);

    // add/remove
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export default function App() {
  const isSp = useMediaQuery(MQ_SP);

  // ✅ デバッグ用：htmlに属性（CSS側で分岐したい時に使える）
  useEffect(() => {
    const el = document.documentElement;
    if (!el) return;
    el.dataset.device = isSp ? "sp" : "pc";
  }, [isSp]);

  // ✅ DOM完全分離：同時描画しない
  if (isSp) {
    return (
      <>
        <HeaderSp />
        <HeroSp />
        <ConceptSp />
        <PlanSp />
        <CostumeSp />
        <GallerySp />
        <FlowSp />
        <QASp />
        <AccessSp />
        <ReserveSp />
        <FooterSp />
      </>
    );
  }

  return (
    <>
      <Header />
      <Hero />
      <Concept />
      <Plan />
      <Costume />
      <Gallery />
      <Flow />
      <QA />
      <Access />
      <Reserve />
      <Footer />
    </>
  );
}