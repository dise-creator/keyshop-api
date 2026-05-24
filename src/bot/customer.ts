import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import prisma from '../lib/prisma';

let customerBot: TelegramBot;

export const getCustomerBot = () => customerBot;

const ACTIVATION_INSTRUCTIONS: Record<string, string> = {
  playstation: `📖 Как активировать ключ PS5:\n1. Войди в аккаунт PlayStation нужного региона (Турция или Индия)\n2. Открой PlayStation Store → «Погасить код»\n3. Введи код выше — деньги зачислятся мгновенно\n\n💡 VPN не нужен. Регион аккаунта должен совпадать с регионом ключа.`,
  steam: `📖 Как активировать ключ Steam:\n1. Открой клиент Steam\n2. Внизу слева → «Добавить игру» → «Активировать через Steam»\n3. Введи код выше — баланс обновится мгновенно\n\n💡 VPN не нужен.`,
  'ai-services': `📖 Как активировать подписку:\n1. Включи VPN (европейский или американский сервер)\n2. Войди на сайт сервиса и перейди в раздел оплаты\n3. Введи данные карты из письма как обычную карту\n\n💡 VPN нужен только для активации. После — можно отключить.`,
  other: `📖 Как активировать подписку:\n1. Включи VPN (европейский или американский сервер)\n2. Войди на сайт сервиса и перейди в раздел оплаты\n3. Введи данные карты из письма как обычную карту\n\n💡 После активации VPN можно отключить.`,
};

export const initCustomerBot = () => {
  const token = process.env.CUSTOMER_BOT_TOKEN!;
  customerBot = new TelegramBot(token, { polling: true });

  customerBot.onText(/\/start/, async (msg: Message) => {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || 'друг';
    await customerBot.sendMessage(chatId,
      `👋 Привет, ${firstName}!\n\nДобро пожаловать в KeyCapp — магазин цифровых ключей для PS5, Steam, ChatGPT и других сервисов.\n\n🔑 Покупай ключи на сайте и получай их прямо здесь в Telegram.\n\n📧 Чтобы привязать Telegram к заказам, отправь свой email:`
    );
  });

  customerBot.on('message', async (msg: Message) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();
    if (!text || text.startsWith('/')) return;
    if (!text.includes('@') || !text.includes('.')) return;

    const email = text.toLowerCase();
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        await customerBot.sendMessage(chatId,
          `❌ Email ${email} не найден в системе.\n\nСначала сделай заказ на сайте, потом привяжи Telegram.`
        );
        return;
      }
      await prisma.user.update({
        where: { email },
        data: { telegramId: BigInt(chatId) }
      });
      await customerBot.sendMessage(chatId,
        `✅ Telegram привязан к ${email}!\n\nТеперь ключи и уведомления о заказах будут приходить сюда.`
      );
    } catch (err) {
      console.error('Ошибка привязки telegram:', err);
    }
  });

  customerBot.onText(/\/orders/, async (msg: Message) => {
    const chatId = msg.chat.id;
    try {
      const user = await prisma.user.findFirst({
        where: { telegramId: BigInt(chatId) }
      });
      if (!user) {
        await customerBot.sendMessage(chatId, '❌ Telegram не привязан. Отправь свой email для привязки.');
        return;
      }
      const orders = await prisma.order.findMany({
        where: { userId: user.id },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { product: { include: { platform: true, region: true } } }
      });
      if (orders.length === 0) {
        await customerBot.sendMessage(chatId, '📦 У тебя пока нет заказов.');
        return;
      }
      const text = orders.map(o =>
        `🛒 ${o.product.platform.name} ${o.product.region.flag} ${o.product.amount} ${o.product.region.currency}\n💰 ${o.amountRub.toLocaleString('ru-RU')} ₽ | ${o.status === 'completed' ? '✅ Выполнен' : '⏳ В ожидании'}\n📅 ${o.createdAt.toLocaleDateString('ru')}`
      ).join('\n\n');
      await customerBot.sendMessage(chatId, `📦 Твои заказы:\n\n${text}`);
    } catch (err) {
      console.error('Ошибка /orders:', err);
    }
  });

  customerBot.onText(/\/support/, async (msg: Message) => {
    const chatId = msg.chat.id;
    await customerBot.sendMessage(chatId,
      `🆘 Поддержка KeyCapp\n\nЕсли у тебя проблема с заказом — напиши нам напрямую:\n👉 @keycappbot\n\nМы отвечаем в течение нескольких минут.`
    );
  });

  customerBot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id;
    const data = query.data;
    if (!chatId || !data) return;

    if (data.startsWith('rating:')) {
      const parts = data.split(':');
      const orderId = parts[1];
      const rating = parseInt(parts[2]);

      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { user: true }
        });
        if (!order) return;

        const existing = await prisma.review.findUnique({ where: { orderId } });
        if (existing) {
          await customerBot.answerCallbackQuery(query.id, { text: 'Ты уже оставил отзыв!' });
          return;
        }

        await prisma.review.create({
          data: {
            orderId,
            userId: order.userId,
            rating,
            telegramId: BigInt(chatId),
          }
        });

        await customerBot.answerCallbackQuery(query.id, { text: `Спасибо! Поставил ${rating}⭐` });

        const stars = '⭐'.repeat(rating);
        await customerBot.editMessageText(
          `${stars} Отлично, спасибо за оценку!\n\nХочешь оставить комментарий? Просто напиши его — или пропусти командой /skip`,
          {
            chat_id: chatId,
            message_id: query.message?.message_id,
          }
        );

        pendingComments.set(chatId, orderId);
      } catch (err) {
        console.error('Ошибка сохранения рейтинга:', err);
      }
    }
  });

  customerBot.onText(/\/skip/, async (msg: Message) => {
    const chatId = msg.chat.id;
    pendingComments.delete(chatId);
    await customerBot.sendMessage(chatId, '👍 Окей, спасибо за оценку!');
  });

  customerBot.on('message', async (msg: Message) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();
    if (!text || text.startsWith('/')) return;
    if (text.includes('@')) return;

    const orderId = pendingComments.get(chatId);
    if (!orderId) return;

    try {
      await prisma.review.update({
        where: { orderId },
        data: { comment: text }
      });
      pendingComments.delete(chatId);
      await customerBot.sendMessage(chatId, '💬 Комментарий сохранён! Спасибо — это очень помогает нам становиться лучше. 🙏');
    } catch (err) {
      console.error('Ошибка сохранения комментария:', err);
    }
  });

  console.log('🤖 Customer бот запущен (@keycappbot)');
};

const pendingComments = new Map<number, string>();

export const sendKeyToTelegram = async (
  telegramId: bigint,
  keyCode: string,
  platformName: string,
  platformSlug: string,
  amount: string,
  amountRub: number,
  orderId: string
) => {
  if (!customerBot) return;
  try {
    const instructions = ACTIVATION_INSTRUCTIONS[platformSlug] ?? ACTIVATION_INSTRUCTIONS['other'];
    await customerBot.sendMessage(Number(telegramId),
      `✅ Твой заказ выполнен!\n\n🎮 ${platformName} ${amount}\n💰 ${amountRub.toLocaleString('ru-RU')} ₽\n\n🔑 Ключ активации:\n${keyCode}\n\n${instructions}`
    );
    setTimeout(async () => {
      try {
        await customerBot.sendMessage(Number(telegramId),
          `⭐ Как прошла покупка? Оцени — это займёт 5 секунд:`,
          {
            reply_markup: {
              inline_keyboard: [[
                { text: '😞 1', callback_data: `rating:${orderId}:1` },
                { text: '😐 2', callback_data: `rating:${orderId}:2` },
                { text: '🙂 3', callback_data: `rating:${orderId}:3` },
                { text: '😊 4', callback_data: `rating:${orderId}:4` },
                { text: '🤩 5', callback_data: `rating:${orderId}:5` },
              ]]
            }
          }
        );
      } catch (err) {
        console.error('Ошибка отправки запроса отзыва:', err);
      }
    }, 3000);
  } catch (err) {
    console.error('Ошибка отправки ключа в Telegram:', err);
  }
};

export const notifyKeyReady = async (
  telegramId: bigint,
  keyCode: string,
  platformName: string,
  platformSlug: string,
  amount: string,
  orderId: string
) => {
  if (!customerBot) return;
  try {
    const instructions = ACTIVATION_INSTRUCTIONS[platformSlug] ?? ACTIVATION_INSTRUCTIONS['other'];
    await customerBot.sendMessage(Number(telegramId),
      `🎉 Ключ готов!\n\n🎮 ${platformName} ${amount}\n\n🔑 Ключ активации:\n${keyCode}\n\n${instructions}`
    );
    setTimeout(async () => {
      try {
        await customerBot.sendMessage(Number(telegramId),
          `⭐ Оцени покупку:`,
          {
            reply_markup: {
              inline_keyboard: [[
                { text: '😞 1', callback_data: `rating:${orderId}:1` },
                { text: '😐 2', callback_data: `rating:${orderId}:2` },
                { text: '🙂 3', callback_data: `rating:${orderId}:3` },
                { text: '😊 4', callback_data: `rating:${orderId}:4` },
                { text: '🤩 5', callback_data: `rating:${orderId}:5` },
              ]]
            }
          }
        );
      } catch (err) {
        console.error('Ошибка отправки запроса отзыва:', err);
      }
    }, 3000);
  } catch (err) {
    console.error('Ошибка уведомления о ключе:', err);
  }
};