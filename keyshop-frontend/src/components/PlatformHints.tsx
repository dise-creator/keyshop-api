import { useState } from "react";

interface Hint {
  question: string;
  answer: string;
}

interface PlatformData {
  emoji: string;
  tagline: string;
  hints: Hint[];
}

const PLATFORM_HINTS: Record<string, PlatformData> = {
  playstation: {
    emoji: "🎮",
    tagline: "Прочитай перед покупкой — 2 минуты сэкономят часы",
    hints: [
      {
        question: "Нужен ли отдельный аккаунт PlayStation для турецкого/индийского региона?",
        answer:
          "Да. Ключи региональные: турецкий ключ активируется только на аккаунте с регионом «Турция», индийский — только на «Индия». Если у тебя уже есть такой аккаунт — отлично. Если нет — создай новый на сайте PlayStation, выбрав нужный регион.",
      },
      {
        question: "Как активировать код на консоли?",
        answer:
          "Войди в нужный аккаунт на PS5 → открой PlayStation Store → прокрути вниз до раздела «Погасить код» (Redeem Codes) → введи 12-значный код из письма. Деньги зачислятся мгновенно.",
      },
      {
        question: "Нужен ли VPN для активации?",
        answer:
          "Нет. VPN не нужен ни для активации кода, ни для игры. Достаточно правильного регионального аккаунта.",
      },
      {
        question: "Можно ли играть со своего основного аккаунта?",
        answer:
          "Да! Включи «Общий доступ к консоли» на турецком/индийском аккаунте (Настройки → Пользователи и аккаунты → Другое → Общий доступ к консоли). После этого все игры и пополнения будут доступны твоему основному профилю без переключений.",
      },
      {
        question: "Код не активируется — что делать?",
        answer:
          "Первым делом проверь: регион аккаунта должен точно совпадать с регионом ключа. Это причина 99% проблем. Если регион верный — попробуй активировать через веб-сайт PlayStation, а не через консоль. Всё равно не работает? Пиши нам в Telegram.",
      },
    ],
  },
  steam: {
    emoji: "🕹️",
    tagline: "Быстро и просто — но есть пара нюансов",
    hints: [
      {
        question: "Как активировать ключ пополнения в Steam?",
        answer:
          "Открой клиент Steam → внизу слева нажми «Добавить игру» → «Активировать через Steam» → введи ключ из письма. Деньги появятся на балансе в течение нескольких секунд.",
      },
      {
        question: "Нужен ли отдельный аккаунт Steam?",
        answer:
          "Для большинства ключей пополнения — нет, подойдёт любой существующий аккаунт. Но если у тебя аккаунт с российским регионом, турецкий ключ может не приняться. В этом случае потребуется аккаунт с регионом Турция или Индия.",
      },
      {
        question: "Вижу «У вас уже есть этот продукт» — ключ сломан?",
        answer:
          "Нет, ключ рабочий. Это сообщение означает, что игра уже есть на твоём аккаунте. Ключ можно активировать на другом аккаунте Steam.",
      },
      {
        question: "Через сколько зачислятся деньги?",
        answer: "Мгновенно — сразу после ввода кода баланс обновляется.",
      },
    ],
  },
  "ai-services": {
    emoji: "🤖",
    tagline: "У каждого сервиса своя механика — читай внимательно",
    hints: [
      {
        question: "Почему нельзя просто оплатить картой?",
        answer:
          "Сервисы используют платёжную систему Stripe, которая с 2022 года блокирует все карты с российским BIN — Visa, Mastercard, Мир, UnionPay. Именно поэтому покупка ключа через нас — самый простой способ получить доступ.",
      },
      {
        question: "Как активировать ChatGPT Plus ($20)?",
        answer:
          "Войди на chat.openai.com → нажми на иконку профиля (внизу слева) → «Upgrade plan» → «Upgrade to Plus». На странице оплаты введи данные карты, которую мы пришлём тебе вместе с ключом. Нужен VPN (любой европейский или американский сервер).",
      },
      {
        question: "Как активировать Midjourney ($10)?",
        answer:
          "Зайди на midjourney.com → «Sign In» → «Manage Sub» → выбери план Basic → на странице оплаты используй данные карты из письма. Потребуется VPN.",
      },
      {
        question: "Как активировать Claude Pro ($30)?",
        answer:
          "Войди на claude.ai → «Upgrade to Pro» → на странице оплаты введи данные карты из письма. Потребуется VPN с американским или европейским IP.",
      },
      {
        question: "Нужен ли VPN?",
        answer:
          "Да, для активации ИИ-подписок нужен VPN. Подойдёт любой платный или бесплатный сервис (ProtonVPN, Windscribe) — достаточно американского или европейского сервера. После активации VPN для использования сервиса не нужен.",
      },
      {
        question: "На сколько действует подписка?",
        answer:
          "Все подписки — месячные. По истечении месяца автопродления не будет (ключ одноразовый). Для продления нужно будет купить новый ключ.",
      },
    ],
  },
  other: {
    emoji: "✨",
    tagline: "Spotify, YouTube, Adobe — у каждого своя активация",
    hints: [
      {
        question: "Как активировать Spotify ($10)?",
        answer:
          "Войди на spotify.com → «Account» → «Your plan» → «Change plan» → Premium. На странице оплаты используй данные карты из письма. Может потребоваться VPN.",
      },
      {
        question: "Как активировать YouTube Premium ($14)?",
        answer:
          "Зайди на youtube.com → иконка профиля → «Получить Premium». На странице оплаты введи данные карты из письма. Рекомендуем использовать VPN с американским сервером.",
      },
      {
        question: "Как активировать Adobe Creative Cloud ($55)?",
        answer:
          "Зайди на adobe.com → «Sign In» → «Plans» → выбери нужный план → оплати картой из письма. Потребуется VPN. После оплаты можешь отключить VPN — приложения работают без него.",
      },
      {
        question: "Нужен ли VPN?",
        answer:
          "Для большинства сервисов — да, на этапе оплаты. После активации подписки VPN обычно не нужен для повседневного использования.",
      },
      {
        question: "Что такое «данные карты» в письме?",
        answer:
          "Мы присылаем реквизиты виртуальной иностранной карты с нужным балансом. Ты вводишь их на сайте сервиса как обычную карту. Карта одноразовая — только для этой активации.",
      },
    ],
  },
};

interface Props {
  activePlatform: string;
}

export default function PlatformHints({ activePlatform }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const data = PLATFORM_HINTS[activePlatform];
  if (!data) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>{data.emoji}</span>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Важно перед покупкой
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 1 }}>
            {data.tagline}
          </div>
        </div>
      </div>

      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}
      >
        {data.hints.map((hint, i) => {
          const isOpen = openIndex === i;
          const isLast = i === data.hints.length - 1;

          return (
            <div key={i} style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    lineHeight: 1.4,
                  }}
                >
                  {hint.question}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    color: "var(--accent)",
                    flexShrink: 0,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </button>

              <div
                style={{
                  maxHeight: isOpen ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px 14px",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {hint.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}