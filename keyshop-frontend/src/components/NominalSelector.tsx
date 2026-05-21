interface Product {
  id: string;
  regionId: string;
  amount: number;
  priceRub: number;
  isPopular: boolean;
  region: { id: string; code: string; name: string; flag: string; currency: string };
}

interface NominalSelectorProps {
  products: Product[];
  activeRegion: string;
  activeNominal: string;
  onNominalChange: (id: string, price: number, label: string) => void;
}

export default function NominalSelector({ products, activeRegion, activeNominal, onNominalChange }: NominalSelectorProps) {
  const filtered = products.filter((p) => p.regionId === activeRegion);

  return (
    <div style={styles.wrap}>
      <p style={styles.label}>Номинал</p>
      <div style={styles.grid}>
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onNominalChange(p.id, p.priceRub, `${p.amount} ${p.region.currency}`)}
            style={{
              ...styles.card,
              ...(activeNominal === p.id ? styles.cardActive : {}),
            }}
          >
            {p.isPopular && <p style={styles.hit}>Хит</p>}
            <p style={styles.amount}>{p.amount} {p.region.currency}</p>
            <p style={styles.price}>{Math.round(p.priceRub).toLocaleString("ru-RU")} ₽</p>
            {activeNominal === p.id && <span style={styles.dot} />}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { marginBottom: 28 },
  label: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8A9BBB",
    marginBottom: 12,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
  card: {
    position: "relative",
    padding: "14px 10px",
    border: "0.5px solid rgba(30,80,180,0.25)",
    borderRadius: 10,
    background: "#ffffff",
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  cardActive: {
    border: "0.5px solid #F57C20",
    background: "#FEF0E4",
  },
  hit: { fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "#F57C20", marginBottom: 3 },
  amount: { fontSize: 14, fontWeight: 600, color: "#0F1B3D", marginBottom: 3 },
  price: { fontSize: 12, color: "#4A5A7A" },
  dot: {
    position: "absolute", top: 8, right: 8,
    width: 6, height: 6, borderRadius: "50%",
    background: "#F57C20", display: "block",
  },
};