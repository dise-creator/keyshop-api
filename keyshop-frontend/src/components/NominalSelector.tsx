const nominalsByPlatformAndRegion: Record<string, Record<string, { id: string; amount: string; price: number; popular?: boolean }[]>> = {
  playstation: {
    tr: [
      { id: "ps-tr-100", amount: "100 TRY", price: 250 },
      { id: "ps-tr-250", amount: "250 TRY", price: 620, popular: true },
      { id: "ps-tr-500", amount: "500 TRY", price: 1240 },
      { id: "ps-tr-1000", amount: "1000 TRY", price: 2480 },
    ],
    kz: [
      { id: "ps-kz-2000", amount: "2 000 KZT", price: 340 },
      { id: "ps-kz-5000", amount: "5 000 KZT", price: 890, popular: true },
      { id: "ps-kz-10000", amount: "10 000 KZT", price: 1780 },
    ],
    ar: [
      { id: "ps-ar-500", amount: "500 ARS", price: 380 },
      { id: "ps-ar-1000", amount: "1 000 ARS", price: 760, popular: true },
      { id: "ps-ar-2000", amount: "2 000 ARS", price: 1520 },
    ],
  },
  steam: {
    tr: [
      { id: "st-tr-50", amount: "50 TRY", price: 125 },
      { id: "st-tr-100", amount: "100 TRY", price: 250, popular: true },
      { id: "st-tr-250", amount: "250 TRY", price: 620 },
      { id: "st-tr-500", amount: "500 TRY", price: 1240 },
    ],
    kz: [
      { id: "st-kz-1000", amount: "1 000 KZT", price: 170 },
      { id: "st-kz-2500", amount: "2 500 KZT", price: 445, popular: true },
      { id: "st-kz-5000", amount: "5 000 KZT", price: 890 },
    ],
  },
  "ai-services": {
    usd: [
      { id: "ai-chatgpt", amount: "ChatGPT Plus", price: 2100, popular: true },
      { id: "ai-midjourney", amount: "Midjourney", price: 1050 },
      { id: "ai-claude", amount: "Claude Pro", price: 3150 },
    ],
  },
  other: {
    usd: [
      { id: "ot-spotify", amount: "Spotify $10", price: 1050, popular: true },
      { id: "ot-youtube", amount: "YouTube $14", price: 1470 },
      { id: "ot-adobe", amount: "Adobe CC $55", price: 5775 },
    ],
  },
};

interface NominalSelectorProps {
  activePlatform: string;
  activeRegion: string;
  activeNominal: string;
  onNominalChange: (id: string, price: number, label: string) => void;
}

export default function NominalSelector({ activePlatform, activeRegion, activeNominal, onNominalChange }: NominalSelectorProps) {
  const nominals = nominalsByPlatformAndRegion[activePlatform]?.[activeRegion] ?? [];

  return (
    <div style={styles.wrap}>
      <p style={styles.label}>Номинал</p>
      <div style={styles.grid}>
        {nominals.map((n) => (
          <button
            key={n.id}
            onClick={() => onNominalChange(n.id, n.price, n.amount)}
            style={{
              ...styles.card,
              ...(activeNominal === n.id ? styles.cardActive : {}),
            }}
          >
            {n.popular && <p style={styles.hit}>Хит</p>}
            <p style={styles.amount}>{n.amount}</p>
            <p style={styles.price}>{n.price.toLocaleString("ru-RU")} ₽</p>
            {activeNominal === n.id && <span style={styles.dot} />}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
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
    borderColor: "#F57C20",
    background: "#FEF0E4",
  },
  hit: {
    fontSize: 9,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#F57C20",
    marginBottom: 3,
  },
  amount: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0F1B3D",
    marginBottom: 3,
  },
  price: {
    fontSize: 12,
    color: "#4A5A7A",
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#F57C20",
    display: "block",
  },
};