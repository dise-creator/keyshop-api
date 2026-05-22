import React, { useState } from "react";

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
  const [expanded, setExpanded] = useState(false);
  const filtered = products.filter((p) => p.regionId === activeRegion);
  const visible = expanded ? filtered : filtered.slice(0, 4);
  const hasMore = filtered.length > 4;

  return (
    <div style={styles.wrap}>
      <p style={styles.label}>Номинал</p>
      <div style={styles.grid}>
        {visible.map((p) => (
          <button
            key={p.id}
            onClick={() => onNominalChange(p.id, p.priceRub, `${p.amount} ${p.region.currency}`)}
            style={{
              ...styles.card,
              ...(activeNominal === p.id ? styles.cardActive : {}),
            }}
          >
            <p style={styles.amount}>{p.amount} {p.region.currency}</p>
            <p style={styles.price}>{Math.round(p.priceRub).toLocaleString("ru-RU")} ₽</p>
            {activeNominal === p.id && <span style={styles.dot} />}
          </button>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={styles.toggleBtn}
        >
          <span>{expanded ? "Свернуть" : "Все номиналы"}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { marginBottom: 28, minHeight: 120 },
  label: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 12,
    transition: "color 0.3s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  
  cardActive: {
    border: "0.5px solid var(--border-nominal-active)",
    background: "var(--bg-nominal-active)",
  },
  card: {
    position: "relative",
    padding: "8px 6px",
    border: "0.5px solid var(--border-nominal)",
    borderRadius: 8,
    background: "var(--bg-nominal)",
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  amount: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 1,
    transition: "color 0.3s",
  },
  price: {
    fontSize: 10,
    color: "var(--text-secondary)",
    transition: "color 0.3s",
  },
  dot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "block",
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    fontSize: 12,
    color: "var(--text-muted)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    fontFamily: "inherit",
    transition: "color 0.2s",
  },
};