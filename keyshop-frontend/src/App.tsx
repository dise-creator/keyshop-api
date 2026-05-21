import { useState, useEffect } from "react";
import Header from "./components/Header";
import RegionSelector from "./components/RegionSelector";
import NominalSelector from "./components/NominalSelector";
import Checkout from "./components/Checkout";
import Footer from "./components/Footer";
import { getPlatforms, getAllProducts } from "./api";

interface Product {
  id: string;
  platformId: string;
  regionId: string;
  amount: number;
  priceRub: number;
  isPopular: boolean;
  region: { id: string; code: string; name: string; flag: string; currency: string };
  platform: { id: string; slug: string; name: string };
}

export default function App() {
  const [platforms, setPlatforms] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activePlatform, setActivePlatform] = useState("");
  const [activeRegion, setActiveRegion] = useState("");
  const [activeNominal, setActiveNominal] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    getPlatforms().then((data) => {
      setPlatforms(data);
      if (data.length > 0) setActivePlatform(data[0].slug);
    });
    getAllProducts().then(setAllProducts);
  }, []);

  // Регионы для активной платформы
  const regions = Object.values(
    allProducts
      .filter((p) => p.platform.slug === activePlatform)
      .reduce((acc, p) => {
        acc[p.region.id] = p.region;
        return acc;
      }, {} as Record<string, Product["region"]>)
  );

  // При смене платформы — выбираем первый регион
  useEffect(() => {
    if (regions.length > 0 && !regions.find((r) => r.id === activeRegion)) {
      setActiveRegion(regions[0].id);
      setActiveNominal("");
      setSelectedPrice(0);
    }
  }, [activePlatform, allProducts]);

  function handlePlatformChange(slug: string) {
    setActivePlatform(slug);
    setActiveRegion("");
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
        platforms={platforms}
        activePlatform={activePlatform}
        onPlatformChange={handlePlatformChange}
      />
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "44px 24px" }}>
        <RegionSelector
          regions={regions}
          activeRegion={activeRegion}
          onRegionChange={handleRegionChange}
        />
        <NominalSelector
          products={allProducts.filter(
            (p) => p.platform.slug === activePlatform && p.regionId === activeRegion
          )}
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