import React, { useState } from "react";

interface Platform {
  id: string;
  slug: string;
  name: string;
}

interface PlatformConfig {
  gradient: string;
  svg: React.ReactElement;
}

const platformConfig: Record<string, PlatformConfig> = {
  playstation: {
    gradient: "linear-gradient(135deg, #003087 0%, #0070cc 100%)",
    svg: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
        <path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827C13.07 3.65 10.648 2.912 8.984 2.596zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z" />
      </svg>
    ),
  },
  steam: {
    gradient: "linear-gradient(135deg, #1b2838 0%, #2a475e 100%)",
    svg: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
      </svg>
    ),
  },
  "ai-services": {
    gradient: "linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)",
    svg: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.04 14.11A4.501 4.501 0 0 1 2.34 7.896zm16.597 3.855l-5.843-3.372L15.11 7.21a.076.076 0 0 1 .071 0l4.816 2.79a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.384-.676zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.814-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
      </svg>
    ),
  },
  other: {
    gradient: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
    svg: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
};

interface HeaderProps {
  platforms: Platform[];
  activePlatform: string;
  onPlatformChange: (slug: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Header({
  platforms,
  activePlatform,
  onPlatformChange,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const isDark = theme === "dark";
  const [pressing, setPressing] = useState(false);

  return (
    <>
      <header style={styles.header}>
        <a href="/" style={{ textDecoration: "none" }}>
  <div style={styles.logoWrap}>
    <div style={styles.logoIcon}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
          stroke="#F57C20"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div style={styles.logoTextWrap}>
      <span style={styles.logoText}>
        Key<span style={styles.logoAccent}>capp</span>
      </span>
    </div>
  </div>
</a>

        <div
          onClick={onToggleTheme}
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          style={{
            ...styles.toggle,
            background: isDark ? "rgba(30,80,180,0.5)" : "#F57C20",
          }}
        >
          <div
            style={{
              ...styles.toggleKnob,
              transform: `translateX(${isDark ? "30px" : "0px"}) scale(${pressing ? 1.25 : 1})`,
              boxShadow: pressing
                ? "0 2px 8px rgba(0,0,0,0.3), 0 0 0 8px rgba(245,124,32,0.25)"
                : "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>
              {isDark ? "☀️" : "🌙"}
            </span>
          </div>
        </div>
      </header>

      <div style={styles.platformsWrap}>
        <div style={styles.platformsRow}>
          {platforms.map((p) => {
            const config = platformConfig[p.slug];
            const isActive = activePlatform === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => onPlatformChange(p.slug)}
                style={{
                  ...styles.platformBtn,
                  background: config?.gradient ?? "linear-gradient(135deg, #666, #999)",
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                  boxShadow: isActive
                    ? "0 8px 24px rgba(0,0,0,0.35)"
                    : "0 2px 8px rgba(0,0,0,0.15)",
                }}
                title={p.name}
              >
                {config?.svg}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    background: "var(--bg-header)",
    borderBottom: "0.5px solid var(--border-header)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    transition: "background 0.3s, border-color 0.3s",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "rgba(245, 124, 32, 0.12)",
    border: "1px solid rgba(245, 124, 32, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoTextWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "var(--text-primary)",
    lineHeight: 1,
    transition: "color 0.3s",
  },
  logoAccent: {
    color: "#F57C20",
  },
  logoSub: {
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    transition: "color 0.3s",
  },
  toggle: {
    width: 72,
    height: 38,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    padding: "4px",
    cursor: "pointer",
    border: "1px solid var(--border-btn)",
    flexShrink: 0,
    transition: "background 0.3s",
  },
  toggleKnob: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s",
  },
  platformsWrap: {
    background: "var(--bg-header)",
    borderBottom: "0.5px solid var(--border-header)",
    padding: "16px 28px",
    transition: "background 0.3s",
    display: "flex",
    justifyContent: "center",
  },
  platformsRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
platformBtn: {
  width: 110,
  height: 110,
  borderRadius: 24,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  transition: "all 0.2s ease",
  flexShrink: 0,
},
};