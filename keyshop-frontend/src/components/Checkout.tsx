import { useState } from "react";
import React from "react";

interface CheckoutProps {
  price: number;
  label: string;
  productId: string;
}

export default function Checkout({ price, label, productId }: CheckoutProps) {
  const [email, setEmail] = useState("");
  const [checks, setChecks] = useState({ terms: false, noRefund: false, privacy: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const allChecked = checks.terms && checks.noRefund && checks.privacy;
  const canBuy = allChecked && email.includes("@") && price > 0 && !loading;

  function toggle(key: keyof typeof checks) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://213.176.66.225:3000/api/orders/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error ?? "Что-то пошло не так");
      }
    } catch {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={styles.success}>
        <p style={styles.successIcon}>✓</p>
        <p style={styles.successTitle}>Заказ оформлен!</p>
        <p style={styles.successText}>
          Мы свяжемся с вами на <strong>{email}</strong> в ближайшее время.
        </p>
        <a href="https://t.me/ВАШ_TELEGRAM" style={styles.tgBtn} target="_blank">
          Написать в Telegram
        </a>
      </div>
    );
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
          <span style={styles.text}>Я понимаю, что цифровые товары не подлежат возврату</span>
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
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.priceRow}>
        <span style={styles.total}>{price > 0 ? `${price.toLocaleString("ru-RU")} ₽` : "—"}</span>
        <span style={styles.hint}>{label || "Выберите номинал"}</span>
      </div>
      <button
        style={{ ...styles.btn, ...(canBuy ? {} : styles.btnDisabled) }}
        disabled={!canBuy}
        onClick={handleBuy}
      >
        {loading ? "Оформляем..." : "Оплатить"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  divider: {
    height: "0.5px",
    background: "var(--border-divider)",
    margin: "4px 0 28px",
    transition: "background 0.3s",
  },
  label: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 12,
    transition: "color 0.3s",
  },
  fieldLabel: {
    fontSize: 12,
    color: "var(--text-secondary)",
    marginBottom: 8,
    transition: "color 0.3s",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "0.5px solid var(--border-input)",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "inherit",
    color: "var(--text-primary)",
    background: "var(--bg-input)",
    outline: "none",
    transition: "all 0.3s",
  },
  checks: { display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" },
  row: { display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" },
  box: {
    width: 16,
    height: 16,
    minWidth: 16,
    border: "0.5px solid var(--border-chip)",
    borderRadius: 4,
    marginTop: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-checkbox)",
    transition: "all 0.15s",
  },
  boxOn: { background: "#F57C20", border: "0.5px solid #F57C20" },
  tick: {
    display: "block",
    width: 8,
    height: 5,
    borderLeft: "1.5px solid #fff",
    borderBottom: "1.5px solid #fff",
    transform: "rotate(-45deg) translateY(-1px)",
  },
  text: {
    fontSize: 12,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
    transition: "color 0.3s",
  },
  link: {
    color: "var(--text-link)",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
  error: { fontSize: 12, color: "#E53935", marginBottom: 12 },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  total: {
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text-primary)",
    transition: "color 0.3s",
  },
  hint: {
    fontSize: 11,
    color: "var(--text-muted)",
    transition: "color 0.3s",
  },
  btn: {
    width: "100%",
    padding: 14,
    background: "var(--accent)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  },
  btnDisabled: { opacity: 0.35, cursor: "not-allowed" },
  success: {
    textAlign: "center",
    padding: "40px 20px",
    background: "var(--bg-card)",
    borderRadius: 12,
    border: "0.5px solid var(--border-success)",
    transition: "all 0.3s",
  },
  successIcon: { fontSize: 32, color: "var(--accent)", marginBottom: 12 },
  successTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 8,
    transition: "color 0.3s",
  },
  successText: {
    fontSize: 13,
    color: "var(--text-secondary)",
    marginBottom: 20,
    lineHeight: 1.6,
    transition: "color 0.3s",
  },
  tgBtn: {
    display: "inline-block",
    padding: "10px 24px",
    background: "var(--bg-btn-active)",
    color: "#fff",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
  },
};