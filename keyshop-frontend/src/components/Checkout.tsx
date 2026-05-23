import { useState } from "react";
import React from "react";

interface CheckoutProps {
  price: number;
  label: string;
  productId: string;
}

type ModalKey = "terms" | "privacy" | null;

const MODAL_CONTENT: Record<Exclude<ModalKey, null>, { title: string; content: React.ReactNode }> = {
  terms: {
    title: "Условия использования",
    content: (
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <p>Используя сайт KeyShop, вы соглашаетесь со следующими условиями:</p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>1. Общие положения</strong><br />
          KeyShop является посредником при продаже цифровых ключей активации для иностранных сервисов. Все продаваемые ключи приобретаются на законных основаниях.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>2. Покупка и доставка</strong><br />
          Цифровые ключи доставляются на указанный email автоматически после подтверждения оплаты. Время доставки — мгновенно.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>3. Возврат</strong><br />
          Цифровые товары не подлежат возврату после выдачи ключа. В случае нерабочего ключа производится бесплатная замена.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>4. Ответственность</strong><br />
          KeyShop не несёт ответственности за блокировку аккаунтов пользователей на сторонних сервисах. Активация ключей производится на страх и риск покупателя в соответствии с правилами соответствующего сервиса.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>5. Изменения</strong><br />
          KeyShop оставляет за собой право изменять условия использования в любое время. Актуальная версия всегда доступна на сайте.
        </p>
      </div>
    ),
  },
  privacy: {
    title: "Политика конфиденциальности",
    content: (
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <p>
          <strong style={{ color: "var(--text-primary)" }}>Какие данные мы собираем</strong><br />
          Только email адрес, необходимый для доставки ключа. Никаких имён, телефонов, адресов.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>Как используем данные</strong><br />
          Email используется исключительно для отправки купленного ключа. Мы не отправляем рекламные рассылки без согласия.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>Передача третьим лицам</strong><br />
          Мы не продаём и не передаём ваши данные третьим лицам. Email передаётся только сервису Resend для технической отправки письма.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>Хранение данных</strong><br />
          Данные хранятся на защищённых серверах. Вы можете запросить удаление своих данных, написав в @clicps_bot.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong style={{ color: "var(--text-primary)" }}>Cookies</strong><br />
          Сайт не использует cookies для отслеживания или рекламы.
        </p>
      </div>
    ),
  },
};

export default function Checkout({ price, label, productId }: CheckoutProps) {
  const [email, setEmail] = useState("");
  const [checks, setChecks] = useState({ terms: false, noRefund: false, privacy: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [keyCode, setKeyCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState<ModalKey>(null);

  const allChecked = checks.terms && checks.noRefund && checks.privacy;
  const canBuy = allChecked && email.includes("@") && price > 0 && !loading;

  function toggle(key: keyof typeof checks) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function openModal(e: React.MouseEvent, key: Exclude<ModalKey, null>) {
    e.stopPropagation();
    setModal(key);
  }

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setKeyCode(data.key ?? null);
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

  function handleCopy() {
    if (!keyCode) return;
    navigator.clipboard.writeText(keyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeModal = modal ? MODAL_CONTENT[modal] : null;

  if (success) {
    return (
      <div style={styles.success}>
        <p style={styles.successIcon}>✓</p>
        <p style={styles.successTitle}>Заказ оформлен!</p>
        {keyCode ? (
          <>
            <p style={styles.successText}>Ваш ключ активации:</p>
            <div style={styles.keyBox}>
              <span style={styles.keyCode}>{keyCode}</span>
              <button style={styles.copyBtn} onClick={handleCopy}>
                {copied ? "Скопировано!" : "Скопировать"}
              </button>
            </div>
            <p style={styles.successText}>
              Инструкция по активации отправлена на <strong>{email}</strong>
            </p>
          </>
        ) : (
          <>
            <p style={styles.successText}>
              Мы свяжемся с вами на <strong>{email}</strong> в ближайшее время.
            </p>
            <a href="https://t.me/clicps_bot" style={styles.tgBtn} target="_blank">
              Написать в Telegram
            </a>
          </>
        )}
      </div>
    );
  }

  return (
    <>
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
          <div style={styles.row} onClick={() => toggle("terms")}>
            <div style={{ ...styles.box, ...(checks.terms ? styles.boxOn : {}) }}>
              {checks.terms && <span style={styles.tick} />}
            </div>
            <span style={styles.text}>
              Я ознакомился с{" "}
              <span style={styles.link} onClick={(e) => openModal(e, "terms")}>
                условиями использования
              </span>{" "}
              и принимаю их
            </span>
          </div>
          <div style={styles.row} onClick={() => toggle("noRefund")}>
            <div style={{ ...styles.box, ...(checks.noRefund ? styles.boxOn : {}) }}>
              {checks.noRefund && <span style={styles.tick} />}
            </div>
            <span style={styles.text}>Я понимаю, что цифровые товары не подлежат возврату</span>
          </div>
          <div style={styles.row} onClick={() => toggle("privacy")}>
            <div style={{ ...styles.box, ...(checks.privacy ? styles.boxOn : {}) }}>
              {checks.privacy && <span style={styles.tick} />}
            </div>
            <span style={styles.text}>
              Согласен на обработку{" "}
              <span style={styles.link} onClick={(e) => openModal(e, "privacy")}>
                персональных данных
              </span>
            </span>
          </div>
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

      {/* Модалка */}
      {activeModal && (
        <div style={styles.overlay} onClick={() => setModal(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>{activeModal.title}</span>
              <button style={styles.closeBtn} onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={styles.modalBody}>{activeModal.content}</div>
          </div>
        </div>
      )}
    </>
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
    fontSize: 14,
    color: "var(--text-secondary)",
    marginBottom: 10,
    transition: "color 0.3s",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "0.5px solid var(--border-input)",
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "inherit",
    color: "var(--text-primary)",
    background: "var(--bg-input)",
    outline: "none",
    transition: "all 0.3s",
  },
  checks: { display: "flex", flexDirection: "column", gap: 16, margin: "24px 0" },
  row: { display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" },
  box: {
    width: 20,
    height: 20,
    minWidth: 20,
    border: "0.5px solid var(--border-chip)",
    borderRadius: 5,
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-checkbox)",
    transition: "all 0.15s",
  },
  boxOn: { background: "#F57C20", border: "0.5px solid #F57C20" },
  tick: {
    display: "block",
    width: 10,
    height: 6,
    borderLeft: "2px solid #fff",
    borderBottom: "2px solid #fff",
    transform: "rotate(-45deg) translateY(-1px)",
  },
  text: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, transition: "color 0.3s" },
  link: {
    color: "var(--text-link)",
    textDecoration: "underline",
    textUnderlineOffset: 2,
    cursor: "pointer",
  },
  error: { fontSize: 12, color: "#E53935", marginBottom: 12 },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  total: { fontSize: 26, fontWeight: 700, color: "var(--text-primary)", transition: "color 0.3s" },
  hint: { fontSize: 13, color: "var(--text-muted)", transition: "color 0.3s" },
  btn: {
    width: "100%",
    padding: 16,
    background: "var(--accent)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
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
  keyBox: {
    background: "var(--bg-btn)",
    border: "1px solid var(--border-nominal-active)",
    borderRadius: 10,
    padding: "14px 16px",
    margin: "12px 0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  keyCode: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--accent)",
    letterSpacing: "0.05em",
    wordBreak: "break-all",
  },
  copyBtn: {
    padding: "6px 14px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    background: "var(--bg-main)",
    borderRadius: 18,
    width: "100%",
    maxWidth: 560,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--border)",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid var(--border)",
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "var(--text-muted)",
    padding: 4,
    lineHeight: 1,
  },
  modalBody: {
    padding: "24px",
    overflowY: "auto",
    color: "var(--text-primary)",
    lineHeight: 1.7,
  },
};