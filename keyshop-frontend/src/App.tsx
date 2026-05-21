import { useState } from "react";
import Header from "./components/Header";
import RegionSelector from "./components/RegionSelector";
import NominalSelector from "./components/NominalSelector";
import Checkout from "./components/Checkout";
import Footer from "./components/Footer";

export default function App() {
  const [activePlatform, setActivePlatform] = useState("playstation");
  const [activeRegion, setActiveRegion] = useState("tr");
  const [activeNominal, setActiveNominal] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState("");

  function handlePlatformChange(id: string) {
    setActivePlatform(id);
    setActiveRegion("tr");
    setActiveNominal("");
    setSelectedPrice(0);
  }

  function handleRegionChange(id: string) {
    setActiveRegion(id);
    setActiveNominal("");
    setSelectedPrice(0);
  }

  function handleNominalChange(id: string, price: number, label: string) {
    setActiveNominal(id);
    setSelectedPrice(price);
    setSelectedLabel(label);
  }

  return (
    <div style={{ background: "#EEF3FB", minHeight: "100vh" }}>
      <Header
        activePlatform={activePlatform}
        onPlatformChange={handlePlatformChange}
      />
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "44px 24px" }}>
        <RegionSelector
          activePlatform={activePlatform}
          activeRegion={activeRegion}
          onRegionChange={handleRegionChange}
        />
        <NominalSelector
          activePlatform={activePlatform}
          activeRegion={activeRegion}
          activeNominal={activeNominal}
          onNominalChange={handleNominalChange}
        />
        <Checkout price={selectedPrice} label={selectedLabel} />
      </main>
      <Footer />
    </div>
  );
}