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
    background: "#ffffff",
    borderTop: "0.5px solid rgba(30,80,180,0.13)",
    padding: "32px 28px 20px",
  },
  title: {
    fontSize: 10,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "#8A9BBB",
    marginBottom: 12,
  },
  item: {
    fontSize: 12,
    color: "#4A5A7A",
    marginBottom: 7,
    cursor: "pointer",
  },
  bottom: {
    background: "#ffffff",
    borderTop: "0.5px solid rgba(30,80,180,0.13)",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
  },
  copy: {
    fontSize: 11,
    color: "#8A9BBB",
  },
};