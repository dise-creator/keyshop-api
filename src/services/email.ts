import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(
  to: string,
  keyCode: string | null,
  productName: string,
  amount: string,
  amountRub: number
) {
  const hasKey = !!keyCode;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: hasKey ? `🔑 Ваш ключ ${productName}` : `✅ Заказ принят — ${productName}`,
    html: hasKey ? `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #0F1B3D;">Ваш ключ активации</h2>
        <p style="color: #4A5A7A;">Спасибо за покупку! Вот ваш ключ для <strong>${productName} ${amount}</strong>:</p>
        
        <div style="background: #EEF3FB; border: 1px solid #F57C20; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="font-size: 22px; font-weight: 700; color: #F57C20; letter-spacing: 0.05em; margin: 0;">${keyCode}</p>
        </div>

        <p style="color: #4A5A7A;">Сумма заказа: <strong>${amountRub.toLocaleString('ru-RU')} ₽</strong></p>
        <p style="color: #8A9BBB; font-size: 12px;">Если у вас возникли вопросы — напишите нам в Telegram.</p>
      </div>
    ` : `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #0F1B3D;">Заказ принят!</h2>
        <p style="color: #4A5A7A;">Ваш заказ на <strong>${productName} ${amount}</strong> успешно оформлен.</p>
        <p style="color: #4A5A7A;">Сумма: <strong>${amountRub.toLocaleString('ru-RU')} ₽</strong></p>
        <p style="color: #4A5A7A;">Мы свяжемся с вами в ближайшее время и отправим ключ активации.</p>
        <p style="color: #8A9BBB; font-size: 12px;">Если у вас возникли вопросы — напишите нам в Telegram.</p>
      </div>
    `,
  });
}