import { useState, useEffect } from "react";
import Header from "./components/Header";
import RegionSelector from "./components/RegionSelector";
import NominalSelector from "./components/NominalSelector";
import Checkout from "./components/Checkout";
import Footer from "./components/Footer";
import { getPlatforms, getPlatformBySlug } from "./api";

export default function App() {
  const [platforms, setPlatforms] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [activePlatform, setActivePlatform] = useState("");
  const [regions, setRegions] = useState<{ id: string; code: string; name: string; flag: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; regionId: string; amount: number; priceRub: number; isPopular: boolean }[]>([]);
  const [activeRegion, setActiveRegion] = useState("");
  const [activeNominal, setActiveNominal] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState("");

  // Загружаем платформы при старте
  useEffect(() => {
    getPlatforms().then((data) => {
      setPlatforms(data);
      if (data.length > 0) loadPlatformData(data[0].slug);
    });
  }, []);

  // Загружаем регионы и продукты при смене платформы
  function loadPlatformData(slug: string) {
    setActivePlatform(slug);
    setActiveRegion("");
    setActiveNominal("");
    setSelectedPrice(0);
    getPlatformBySlug(slug).then((data) => {
      const uniqueRegions = data.products
        ? [...new Map(data.products.map((p: any) => [p.region.id, p.region])).values()]
        : [];
      setRegions(uniqueRegions as any);
      setProducts(data.products ?? []);
      if (uniqueRegions.length > 0) setActiveRegion((uniqueRegions[0] as any).id);
    });
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
        platforms={platforms}
        activePlatform={activePlatform}
        onPlatformChange={loadPlatformData}
      />
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "44px 24px" }}>
        <RegionSelector
          regions={regions}
          activeRegion={activeRegion}
          onRegionChange={handleRegionChange}
        />
        <NominalSelector
          products={products}
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