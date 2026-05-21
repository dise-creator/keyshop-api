import { useState } from "react";

interface CheckoutProps {
  price: number;
  label: string;
}

export default function Checkout({ price, label }: CheckoutProps) {
  const [email, setEmail] = useState("");
  const [checks, setChecks] = useState({ terms: false, noRefund: false, privacy: false });

  const allChecked = checks.terms && checks.noRefund && checks.privacy;
  const canBuy = allChecked && email.includes("@") && price > 0;

  function toggle(key: keyof typeof checks) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <div style={styles.divider} />

      <p style={styles.label}>Оформление</p>

      <p style={styles.fieldLabel}>Email для получения ключа</p>
      <input
        style={styles.input}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div style={styles.checks}>
        <label style={styles.row} onClick={() => toggle("terms")}>
          <div style={{ ...styles.box, ...(checks.terms ? styles.boxOn : {}) }}>
            {checks.terms && <span style={styles.tick} />}
          </div>
          <span style={styles.text}>
            Я ознакомился с <span style={styles.link}>условиями использования</span> и принимаю их
          </span>
        </label>

        <label style={styles.row} onClick={() => toggle("noRefund")}>
          <div style={{ ...styles.box, ...(checks.noRefund ? styles.boxOn : {}) }}>
            {checks.noRefund && <span style={styles.tick} />}
          </div>
          <span style={styles.text}>
            Я понимаю, что цифровые товары не подлежат возврату
          </span>
        </label>

        <label style={styles.row} onClick={() => toggle("privacy")}>
          <div style={{ ...styles.box, ...(checks.privacy ? styles.boxOn : {}) }}>
            {checks.privacy && <span style={styles.tick} />}
          </div>
          <span style={styles.text}>
            Согласен на обработку <span style={styles.link}>персональных данных</span>
          </span>
        </label>
      </div>

      <div style={styles.priceRow}>
        <span style={styles.total}>
          {price > 0 ? `${price.toLocaleString("ru-RU")} ₽` : "—"}
        </span>
        <span style={styles.hint}>{label || "Выберите номинал"}</span>
      </div>

      <button style={{ ...styles.btn, ...(canBuy ? {} : styles.btnDisabled) }} disabled={!canBuy}>
        Оплатить
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  divider: { height: "0.5px", background: "rgba(30,80,180,0.13)", margin: "4px 0 28px" },
  label: { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A9BBB", marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: "#4A5A7A", marginBottom: 8 },
  input: {
    width: "100%", padding: "11px 14px", border: "0.5px solid rgba(30,80,180,0.25)",
    borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#0F1B3D",
    background: "#ffffff", outline: "none",
  },
  checks: { display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" },
  row: { display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" },
  box: {
    width: 16, height: 16, minWidth: 16, border: "0.5px solid rgba(30,80,180,0.25)",
    borderRadius: 4, marginTop: 1, display: "flex", alignItems: "center",
    justifyContent: "center", background: "#ffffff", transition: "all 0.15s",
  },
  boxOn: { background: "#F57C20", borderColor: "#F57C20" },
  tick: {
    display: "block", width: 8, height: 5,
    borderLeft: "1.5px solid #fff", borderBottom: "1.5px solid #fff",
    transform: "rotate(-45deg) translateY(-1px)",
  },
  text: { fontSize: 12, color: "#4A5A7A", lineHeight: 1.5 },
  link: { color: "#1A4DB5", textDecoration: "underline", textUnderlineOffset: 2 },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 },
  total: { fontSize: 22, fontWeight: 700, color: "#0F1B3D" },
  hint: { fontSize: 11, color: "#8A9BBB" },
  btn: {
    width: "100%", padding: 14, background: "#F57C20", color: "#fff",
    fontSize: 14, fontWeight: 700, border: "none", borderRadius: 10,
    cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
  },
  btnDisabled: { opacity: 0.35, cursor: "not-allowed" },
};