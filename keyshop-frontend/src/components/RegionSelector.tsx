interface Region {
  id: string;
  code: string;
  name: string;
  flag: string;
}

interface RegionSelectorProps {
  regions: Region[];
  activeRegion: string;
  onRegionChange: (id: string) => void;
}

export default function RegionSelector({ regions, activeRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <div style={styles.wrap}>
      <p style={styles.label}>Регион</p>
      <div style={styles.chips}>
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => onRegionChange(r.id)}
            style={{
              ...styles.chip,
              ...(activeRegion === r.id ? styles.chipActive : {}),
            }}
          >
            <span>{r.flag}</span>
            {r.name}
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
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    padding: "8px 18px",
    borderRadius: 100,
    border: "0.5px solid rgba(30,80,180,0.25)",
    background: "#ffffff",
    color: "#4A5A7A",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  chipActive: {
    border: "0.5px solid #1A4DB5",
    color: "#1A4DB5",
    background: "#EAF0FF",
    fontWeight: 600,
  },
};