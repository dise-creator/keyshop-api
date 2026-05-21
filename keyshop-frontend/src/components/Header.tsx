

const platforms = [
  {
    id: "playstation",
    label: "PlayStation",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.07 3.4v14.765l3.187 1.02V7.127c0-.51.224-.85.584-.731.464.15.554.618.554 1.128v4.46c1.6.748 2.822-.112 2.822-2.493 0-2.446-.853-3.555-3.43-4.457C11.51 4.553 10.25 4.1 9.07 3.4z" />
        <path d="M17.37 14.91c-1.418.496-2.914.567-4.318.231v1.477l4.02 1.29c1.82.582 2.4-.29 1.298-.963l-.999-.035zM6.762 15.694c-1.647-.005-3.16.332-3.162 1.042 0 .71 1.515 1.376 3.162 1.376.895 0 1.69-.162 2.307-.43v-1.577c-.67.37-1.452.59-2.307.589z" />
      </svg>
    ),
  },
  {
    id: "steam",
    label: "Steam",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0z" />
      </svg>
    ),
  },
  {
    id: "ai-services",
    label: "ChatGPT",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494z" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Spotify",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2z" />
      </svg>
    ),
  },
];

interface HeaderProps {
  activePlatform: string;
  onPlatformChange: (id: string) => void;
}

export default function Header({ activePlatform, onPlatformChange }: HeaderProps) {
  return (
    <header style={styles.header}>
      <span style={styles.logo}>KeyShop</span>
      <nav style={styles.nav}>
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => onPlatformChange(p.id)}
            style={{
              ...styles.btn,
              ...(activePlatform === p.id ? styles.btnActive : {}),
            }}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "13px 28px",
    background: "#ffffff",
    borderBottom: "0.5px solid rgba(30,80,180,0.13)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "#0F1B3D",
    whiteSpace: "nowrap",
  },
  nav: {
    display: "flex",
    gap: 7,
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 12,
    padding: "6px 14px",
    borderRadius: 100,
    border: "0.5px solid rgba(30,80,180,0.25)",
    background: "#F7F9FD",
    color: "#4A5A7A",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  btnActive: {
    background: "#1A4DB5",
    color: "#ffffff",
    borderColor: "#1A4DB5",
    fontWeight: 600,
  },
};