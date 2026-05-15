// src/App.jsx
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

export default function App() {
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