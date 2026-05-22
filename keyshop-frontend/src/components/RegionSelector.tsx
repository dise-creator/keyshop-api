import React from "react";

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
  wrap: { marginBottom: 28, minHeight: 52 },
  label: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 12,
    transition: "color 0.3s",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 15,
    padding: "10px 22px",
    borderRadius: 100,
    border: "0.5px solid var(--border-chip)",
    background: "var(--bg-chip)",
    color: "var(--text-chip)",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  chipActive: {
    border: "0.5px solid var(--border-chip-active)",
    color: "var(--text-chip-active)",
    background: "var(--bg-chip-active)",
    fontWeight: 600,
  },
};