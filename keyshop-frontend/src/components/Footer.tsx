import React from "react";

export default function Footer() {
  return (
    <footer>
      <div style={styles.grid}>
        <div>
          <p style={styles.title}>KeyShop</p>
          <p style={styles.item}>О магазине</p>
          <p style={styles.item}>Как это работает</p>
          <p style={styles.item}>Отзывы</p>
        </div>
        <div>
          <p style={styles.title}>Помощь</p>
          <p style={styles.item}>FAQ</p>
          <p style={styles.item}>Поддержка</p>
          <p style={styles.item}>Telegram</p>
        </div>
        <div>
          <p style={styles.title}>Документы</p>
          <p style={styles.item}>Условия использования</p>
          <p style={styles.item}>Политика конфиденциальности</p>
          <p style={styles.item}>Оферта</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <span style={styles.copy}>© 2025 KeyShop</span>
        <span style={styles.copy}>Все права защищены</span>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 24,
    background: "var(--bg-footer)",
    borderTop: "0.5px solid var(--border-footer)",
    padding: "32px 28px 20px",
    transition: "background 0.3s, border-color 0.3s",
  },
  title: {
    fontSize: 10,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 12,
    transition: "color 0.3s",
  },
  item: {
    fontSize: 12,
    color: "var(--text-secondary)",
    marginBottom: 7,
    cursor: "pointer",
    transition: "color 0.3s",
  },
  bottom: {
    background: "var(--bg-footer)",
    borderTop: "0.5px solid var(--border-footer)",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
    transition: "background 0.3s",
  },
  copy: {
    fontSize: 11,
    color: "var(--text-muted)",
    transition: "color 0.3s",
  },
};