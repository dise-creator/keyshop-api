import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ACTIVATION_INSTRUCTIONS: Record<string, string> = {
  playstation: `
    <h3 style="color: #0F1B3D; margin-bottom: 8px;">Как активировать ключ PS5</h3>
    <ol style="color: #4A5A7A; padding-left: 20px; line-height: 1.8;">
      <li>Войди в аккаунт PlayStation нужного региона (Турция или Индия)</li>
      <li>Открой PlayStation Store на консоли или на сайте</li>
      <li>Прокрути вниз → «Погасить код» (Redeem Codes)</li>
      <li>Введи 12-значный код выше — деньги зачислятся мгновенно</li>
    </ol>
    <p style="color: #8A9BBB; font-size: 12px; margin-top: 8px;">💡 VPN не нужен. Аккаунт должен быть того же региона что и ключ.</p>
  `,
  steam: `
    <h3 style="color: #0F1B3D; margin-bottom: 8px;">Как активировать ключ Steam</h3>
    <ol style="color: #4A5A7A; padding-left: 20px; line-height: 1.8;">
      <li>Открой клиент Steam</li>
      <li>Внизу слева нажми «Добавить игру» → «Активировать через Steam»</li>
      <li>Введи код выше — баланс обновится мгновенно</li>
    </ol>
    <p style="color: #8A9BBB; font-size: 12px; margin-top: 8px;">💡 VPN не нужен. Если аккаунт с российским регионом — может потребоваться аккаунт с регионом Турция или Индия.</p>
  `,
  'ai-services': `
    <h3 style="color: #0F1B3D; margin-bottom: 8px;">Как активировать подписку</h3>
    <ol style="color: #4A5A7A; padding-left: 20px; line-height: 1.8;">
      <li>Включи VPN (европейский или американский сервер)</li>
      <li>Войди на сайт нужного сервиса (chat.openai.com, midjourney.com, claude.ai)</li>
      <li>Перейди в раздел оплаты / Upgrade</li>
      <li>Введи данные карты из письма как обычную карту</li>
    </ol>
    <p style="color: #8A9BBB; font-size: 12px; margin-top: 8px;">💡 VPN обязателен только для активации. После подключения подписки его можно отключить.</p>
  `,
  other: `
    <h3 style="color: #0F1B3D; margin-bottom: 8px;">Как активировать подписку</h3>
    <ol style="color: #4A5A7A; padding-left: 20px; line-height: 1.8;">
      <li>Включи VPN (европейский или американский сервер)</li>
      <li>Войди на сайт сервиса и перейди в раздел оплаты</li>
      <li>Введи данные карты из письма как обычную карту</li>
    </ol>
    <p style="color: #8A9BBB; font-size: 12px; margin-top: 8px;">💡 После активации подписки VPN можно отключить.</p>
  `,
};

export async function sendOrderEmail(
  to: string,
  keyCode: string | null,
  productName: string,
  platformSlug: string,
  amount: string,
  amountRub: number
) {
  const hasKey = !!keyCode;
  const instructions = ACTIVATION_INSTRUCTIONS[platformSlug] ?? ACTIVATION_INSTRUCTIONS['other'];

  await resend.emails.send({
    from: 'Keycapp <noreply@keycapp.com>',
    to,
    subject: hasKey ? `🔑 Ваш ключ ${productName}` : `✅ Заказ принят — ${productName}`,
    html: hasKey ? `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 22px; font-weight: 800; color: #0F1B3D;">Key</span><span style="font-size: 22px; font-weight: 800; color: #F57C20;">capp</span>
        </div>

        <h2 style="color: #0F1B3D; margin-bottom: 8px;">Ваш ключ активации</h2>
        <p style="color: #4A5A7A;">Спасибо за покупку! Вот ваш ключ для <strong>${productName} ${amount}</strong>:</p>

        <div style="background: #EEF3FB; border: 1px solid #F57C20; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="font-size: 22px; font-weight: 700; color: #F57C20; letter-spacing: 0.05em; margin: 0;">${keyCode}</p>
        </div>

        <p style="color: #4A5A7A;">Сумма заказа: <strong>${amountRub.toLocaleString('ru-RU')} ₽</strong></p>

        <div style="background: #F7F9FD; border-radius: 10px; padding: 20px; margin: 24px 0;">
          ${instructions}
        </div>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #EEF3FB;">
          <p style="color: #8A9BBB; font-size: 12px; margin: 0;">Проблемы с активацией? <a href="https://t.me/keycappbot" style="color: #F57C20;">Напишите нам в Telegram</a>.</p>
          <p style="color: #8A9BBB; font-size: 12px; margin-top: 4px;"><a href="https://keycapp.com" style="color: #8A9BBB;">keycapp.com</a></p>
        </div>
      </div>
    ` : `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 22px; font-weight: 800; color: #0F1B3D;">Key</span><span style="font-size: 22px; font-weight: 800; color: #F57C20;">capp</span>
        </div>

        <h2 style="color: #0F1B3D; margin-bottom: 8px;">Заказ принят!</h2>
        <p style="color: #4A5A7A;">Ваш заказ на <strong>${productName} ${amount}</strong> успешно оформлен.</p>
        <p style="color: #4A5A7A;">Сумма: <strong>${amountRub.toLocaleString('ru-RU')} ₽</strong></p>
        <p style="color: #4A5A7A;">Мы свяжемся с вами в ближайшее время и отправим ключ активации.</p>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #EEF3FB;">
          <p style="color: #8A9BBB; font-size: 12px; margin: 0;">Вопросы? <a href="https://t.me/keycappbot" style="color: #F57C20;">Напишите нам в Telegram</a>.</p>
          <p style="color: #8A9BBB; font-size: 12px; margin-top: 4px;"><a href="https://keycapp.com" style="color: #8A9BBB;">keycapp.com</a></p>
        </div>
      </div>
    `,
  });
}