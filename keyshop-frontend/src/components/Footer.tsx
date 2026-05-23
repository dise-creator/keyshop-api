import React, { useState } from "react";

type ModalKey = "about" | "howItWorks" | "faq" | "terms" | "privacy" | "offer";

interface ModalData {
  title: string;
  content: React.ReactNode;
}

const MODAL_CONTENT: Record<ModalKey, ModalData> = {
  about: {
    title: "О магазине",
    content: (
      <div>
        <p>Keycapp — магазин цифровых ключей для сервисов, недоступных в России.</p>
        <p style={{ marginTop: 12 }}>
          Мы работаем как посредник: покупаем ключи пополнения по иностранному курсу и продаём
          в рублях с прозрачной наценкой. Никаких скрытых комиссий.
        </p>
        <p style={{ marginTop: 12 }}>
          Поддерживаем PlayStation 5, Steam, ИИ-сервисы (ChatGPT, Midjourney, Claude) и другие
          платформы — Spotify, YouTube Premium, Adobe CC.
        </p>
        <p style={{ marginTop: 12 }}>
          Ключи выдаются автоматически сразу после оплаты и приходят на email. Если что-то пошло
          не так — мы на связи в Telegram.
        </p>
      </div>
    ),
  },
  howItWorks: {
    title: "Как это работает",
    content: (
      <div>
        {[
          { step: "1", title: "Выбираешь платформу и номинал", desc: "PlayStation, Steam, ChatGPT или другой сервис — выбираешь регион и сумму пополнения." },
          { step: "2", title: "Вводишь email и оплачиваешь", desc: "Никакой регистрации. Просто email — на него придёт ключ. Оплата картой." },
          { step: "3", title: "Получаешь ключ мгновенно", desc: "Ключ показывается на экране сразу после оплаты и дублируется на email." },
          { step: "4", title: "Активируешь по инструкции", desc: "На сайте есть подробный гайд для каждой платформы — прямо перед покупкой." },
        ].map(({ step, title, desc }) => (
          <div key={step} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {step}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  faq: {
    title: "Частые вопросы",
    content: (
      <div>
        {[
          { q: "Когда придёт ключ после оплаты?", a: "Мгновенно — ключ показывается на экране сразу после оплаты и дублируется на email." },
          { q: "Ключ не пришёл на email — что делать?", a: "Проверь папку «Спам». Если там нет — напиши нам в Telegram @keycappbot, разберёмся в течение нескольких минут." },
          { q: "Ключ не активируется — что делать?", a: "Для PS5 и Steam убедись, что регион аккаунта совпадает с регионом ключа. Для ИИ-сервисов нужен VPN. Если проблема осталась — пиши в @keycappbot." },
          { q: "Нужна ли регистрация на сайте?", a: "Нет. Достаточно ввести email при оформлении заказа." },
          { q: "Можно ли вернуть деньги?", a: "Цифровые ключи не подлежат возврату после выдачи. Если ключ оказался нерабочим — заменим бесплатно. Пиши в @keycappbot." },
          { q: "Откуда берётся цена в рублях?", a: "Цена = номинал × курс ЦБ РФ + наценка посредника. Курсы обновляются каждый день автоматически." },
          { q: "Нужен ли VPN?", a: "Для PS5 и Steam — нет. Для ИИ-сервисов (ChatGPT, Midjourney, Claude) и некоторых других — да, на этапе активации." },
        ].map(({ q, a }, i, arr) => (
          <div key={i} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 6 }}>{q}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>
    ),
  },
  terms: {
    title: "Условия использования",
    content: (
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <p>Используя сайт Keycapp, вы соглашаетесь со следующими условиями:</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>1. Общие положения</strong><br />Keycapp является посредником при продаже цифровых ключей активации для иностранных сервисов. Все продаваемые ключи приобретаются на законных основаниях.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>2. Покупка и доставка</strong><br />Цифровые ключи доставляются на указанный email автоматически после подтверждения оплаты. Время доставки — мгновенно.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>3. Возврат</strong><br />Цифровые товары не подлежат возврату после выдачи ключа. В случае нерабочего ключа производится бесплатная замена.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>4. Ответственность</strong><br />Keycapp не несёт ответственности за блокировку аккаунтов пользователей на сторонних сервисах.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>5. Изменения</strong><br />Keycapp оставляет за собой право изменять условия использования в любое время.</p>
      </div>
    ),
  },
  privacy: {
    title: "Политика конфиденциальности",
    content: (
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <p><strong style={{ color: "var(--text-primary)" }}>Какие данные мы собираем</strong><br />Только email адрес, необходимый для доставки ключа. Никаких имён, телефонов, адресов.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Как используем данные</strong><br />Email используется исключительно для отправки купленного ключа. Мы не отправляем рекламные рассылки без согласия.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Передача третьим лицам</strong><br />Мы не продаём и не передаём ваши данные третьим лицам. Email передаётся только сервису Resend для технической отправки письма.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Хранение данных</strong><br />Данные хранятся на защищённых серверах. Вы можете запросить удаление своих данных, написав в @keycappbot.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Cookies</strong><br />Сайт не использует cookies для отслеживания или рекламы.</p>
      </div>
    ),
  },
  offer: {
    title: "Публичная оферта",
    content: (
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <p>Настоящая публичная оферта определяет условия продажи цифровых товаров через сайт Keycapp.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Предмет оферты</strong><br />Продавец (Keycapp) предоставляет Покупателю цифровые ключи активации для иностранных сервисов.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Акцепт оферты</strong><br />Оформление заказа на сайте означает полное и безоговорочное принятие условий настоящей оферты.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Цена и оплата</strong><br />Цена товара указана на сайте в рублях и формируется на основе актуального курса ЦБ РФ с учётом наценки посредника.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Доставка</strong><br />Цифровой ключ доставляется на указанный email немедленно после подтверждения оплаты.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: "var(--text-primary)" }}>Гарантии</strong><br />Продавец гарантирует работоспособность ключа на момент продажи. В случае неработоспособности ключ заменяется бесплатно при обращении в @keycappbot.</p>
      </div>
    ),
  },
};

export default function Footer() {
  const [modal, setModal] = useState<ModalKey | null>(null);

  const open = (m: ModalKey) => setModal(m);
  const close = () => setModal(null);
  const activeModal = modal ? MODAL_CONTENT[modal] : null;

  return (
    <>
      <footer>
        <div style={footerStyles.grid} className="footer-grid">
          <div>
            <p style={footerStyles.title}>Keycapp</p>
            <p style={footerStyles.item} onClick={() => open("about")}>О магазине</p>
            <p style={footerStyles.item} onClick={() => open("howItWorks")}>Как это работает</p>
            <p style={{ ...footerStyles.item, ...footerStyles.itemDisabled }}>Отзывы</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={footerStyles.title}>Помощь</p>
            <p style={footerStyles.item} onClick={() => open("faq")}>FAQ</p>
            <p style={footerStyles.item} onClick={() => window.open("https://t.me/keycappbot", "_blank")}>Поддержка</p>
            <p style={footerStyles.item} onClick={() => window.open("https://t.me/keycappbot", "_blank")}>Telegram</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={footerStyles.title}>Документы</p>
            <p style={footerStyles.item} onClick={() => open("terms")}>Условия использования</p>
            <p style={footerStyles.item} onClick={() => open("privacy")}>Политика конфиденциальности</p>
            <p style={footerStyles.item} onClick={() => open("offer")}>Оферта</p>
          </div>
        </div>

        <div style={footerStyles.bottom} className="footer-bottom">
          <span style={footerStyles.copy}>© 2026 Keycapp</span>
          <span style={footerStyles.copy}>Все права защищены</span>
        </div>
      </footer>

      {activeModal && (
        <div style={footerStyles.overlay} onClick={close}>
          <div style={footerStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={footerStyles.modalHeader}>
              <span style={footerStyles.modalTitle}>{activeModal.title}</span>
              <button style={footerStyles.closeBtn} onClick={close}>✕</button>
            </div>
            <div style={footerStyles.modalBody}>{activeModal.content}</div>
          </div>
        </div>
      )}
    </>
  );
}

const footerStyles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 40,
    background: "var(--bg-footer)",
    borderTop: "0.5px solid var(--border-footer)",
    padding: "40px 60px 28px",
    transition: "background 0.3s, border-color 0.3s",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--text-primary)",
    marginBottom: 14,
    transition: "color 0.3s",
  },
  item: {
    fontSize: 15,
    color: "var(--text-secondary)",
    marginBottom: 10,
    cursor: "pointer",
    transition: "color 0.3s",
  },
  itemDisabled: {
    opacity: 0.35,
    cursor: "default",
    pointerEvents: "none",
  },
  bottom: {
    background: "var(--bg-footer)",
    borderTop: "0.5px solid var(--border-footer)",
    padding: "16px 60px",
    display: "flex",
    justifyContent: "space-between",
    transition: "background 0.3s",
  },
  copy: {
    fontSize: 13,
    color: "var(--text-muted)",
    transition: "color 0.3s",
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
    maxWidth: 680,
    maxHeight: "85vh",
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