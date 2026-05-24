import TelegramBot, { Message } from 'node-telegram-bot-api';
import prisma from '../lib/prisma';

let bot: TelegramBot;

export const getAdminBot = () => bot;

export const notifyAdminNewOrder = async (
  email: string,
  platformName: string,
  amount: string,
  amountRub: number,
  hasKey: boolean
) => {
  if (!bot) return;
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS || '').split(',').map(id => parseInt(id.trim())).filter(Boolean);
  const text = `🛒 Новый заказ!\n\n👤 ${email}\n🎮 ${platformName} ${amount}\n💰 ${amountRub.toLocaleString('ru-RU')} ₽\n${hasKey ? '✅ Ключ выдан автоматически' : '⏳ Ключей нет — нужно добавить!'}`;
  for (const id of adminIds) {
    try {
      await bot.sendMessage(id, text);
    } catch (err) {
      console.error('Ошибка уведомления админа:', err);
    }
  }
};

export const notifyLowStock = async (platformName: string, amount: string, currency: string, remaining: number) => {
  if (!bot) return;
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS || '').split(',').map(id => parseInt(id.trim())).filter(Boolean);
  for (const id of adminIds) {
    try {
      await bot.sendMessage(id,
        `⚠️ Мало ключей!\n\n🎮 ${platformName} ${amount} ${currency}\n📦 Осталось: ${remaining} шт.\n\nДобавь ключи командой /addkey`
      );
    } catch (err) {
      console.error('Ошибка уведомления о запасах:', err);
    }
  }
};

export const initBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS || '').split(',').map(id => parseInt(id.trim())).filter(Boolean);

  bot = new TelegramBot(token, { polling: true });

  const isAdmin = (chatId: number) => adminIds.includes(chatId);
  const deny = (chatId: number) => bot.sendMessage(chatId, '⛔ Нет доступа');

  bot.onText(/\/start/, (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    bot.sendMessage(msg.chat.id,
`👋 Привет! Я админ-бот KeyCapp.

📦 Заказы
/orders — последние 10 заказов

💱 Курсы и наценки
/rates — курсы и наценки по валютам
/markup USD 0.15 — установить наценку (0.15 = 15%)

🎮 Платформы
/platforms — список платформ и статус
/platform playstation off — выключить платформу

🔑 Ключи
/stock — остатки по всем продуктам
/products — все продукты с ID
/addkey <productId> <код> — добавить ключ
/keys <productId> — ключи конкретного продукта

👥 Пользователи
/users — последние 10 пользователей
/ban <userId> — забанить пользователя

⭐ Отзывы
/reviews — последние 10 отзывов`
    );
  });

  bot.onText(/\/orders/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { product: { include: { platform: true, region: true } } }
    });
    if (orders.length === 0) return bot.sendMessage(msg.chat.id, 'Заказов пока нет');
    const text = orders.map(o =>
      `🛒 #${o.id.slice(0, 8)}\n💰 ${o.amountRub} ₽ | ${o.status}\n🎮 ${o.product.platform.name} ${o.product.region.flag}\n📅 ${o.createdAt.toLocaleDateString('ru')}`
    ).join('\n\n');
    bot.sendMessage(msg.chat.id, text);
  });

  bot.onText(/\/rates/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const rates = await prisma.currency.findMany();
    const text = rates.map(r =>
      `${r.code}: ${r.rate} ₽ | наценка ${(r.markup * 100).toFixed(0)}%`
    ).join('\n');
    bot.sendMessage(msg.chat.id, `💱 Курсы валют:\n\n${text}`);
  });

  bot.onText(/\/markup (\w+) ([\d.]+)/, async (msg: Message, match: RegExpExecArray | null) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const code = match![1].toUpperCase();
    const markup = parseFloat(match![2]);
    if (isNaN(markup) || markup < 0 || markup > 1) {
      return bot.sendMessage(msg.chat.id, '❌ Наценка от 0 до 1 (например 0.15 = 15%)');
    }
    await prisma.currency.update({ where: { code }, data: { markup } });
    bot.sendMessage(msg.chat.id, `✅ Наценка для ${code}: ${(markup * 100).toFixed(0)}%`);
  });

  bot.onText(/\/platforms/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const platforms = await prisma.platform.findMany();
    const text = platforms.map(p =>
      `${p.isActive ? '✅' : '❌'} ${p.name} | /platform ${p.slug} ${p.isActive ? 'off' : 'on'}`
    ).join('\n');
    bot.sendMessage(msg.chat.id, `🎮 Платформы:\n\n${text}`);
  });

  bot.onText(/\/platform ([\w-]+) (on|off)/, async (msg: Message, match: RegExpExecArray | null) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const slug = match![1].trim();
    const isActive = match![2] === 'on';
    try {
      const platform = await prisma.platform.update({ where: { slug }, data: { isActive } });
      bot.sendMessage(msg.chat.id, `${isActive ? '✅' : '❌'} Платформа ${platform.name} ${isActive ? 'включена' : 'выключена'}`);
    } catch (err) {
      bot.sendMessage(msg.chat.id, `❌ Платформа "${slug}" не найдена. Проверь слаг через /platforms`);
    }
  });

  bot.onText(/\/users/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const users = await prisma.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
    const text = users.map(u =>
      `👤 ${u.email}\n🔑 ${u.role} | ${u.id.slice(0, 8)}\n📱 TG: ${u.telegramId ? '✅' : '❌'}`
    ).join('\n\n');
    bot.sendMessage(msg.chat.id, `👥 Пользователи:\n\n${text}`);
  });

  bot.onText(/\/ban (.+)/, async (msg: Message, match: RegExpExecArray | null) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const userId = match![1].trim();
    await prisma.user.update({ where: { id: userId }, data: { role: 'BANNED' } });
    bot.sendMessage(msg.chat.id, `🚫 Пользователь ${userId.slice(0, 8)} заблокирован`);
  });

  bot.onText(/\/stock/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const products = await prisma.product.findMany({
      include: { platform: true, region: true },
      orderBy: [{ platformId: 'asc' }]
    });
    const lines = await Promise.all(products.map(async (p) => {
      const free = await prisma.key.count({ where: { productId: p.id, isUsed: false } });
      const emoji = free === 0 ? '🔴' : free <= 3 ? '🟡' : '🟢';
      return `${emoji} ${p.platform.name} ${p.region.flag} ${p.amount} ${p.region.currency} — ${free} шт.`;
    }));
    bot.sendMessage(msg.chat.id, `📦 Остатки ключей:\n\n${lines.join('\n')}\n\n🔴 нет | 🟡 мало (≤3) | 🟢 ок`);
  });

  bot.onText(/\/addkey (\S+) (\S+)/, async (msg: Message, match: RegExpExecArray | null) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const productId = match![1].trim();
    const code = match![2].trim();

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { platform: true, region: true }
      });
      if (!product) return bot.sendMessage(msg.chat.id, '❌ Продукт не найден');

      await prisma.key.create({ data: { productId, code } });

      const total = await prisma.key.count({ where: { productId, isUsed: false } });
      bot.sendMessage(msg.chat.id,
        `✅ Ключ добавлен!\n\n🎮 ${product.platform.name} ${product.region.flag} ${product.amount} ${product.region.currency}\n🔑 ${code}\n📦 Свободных ключей: ${total}`
      );

      const pendingOrder = await prisma.order.findFirst({
        where: { productId, status: 'pending' },
        orderBy: { createdAt: 'asc' },
        include: { user: true, product: { include: { platform: true, region: true } } }
      });

      if (pendingOrder) {
        const keyToAssign = await prisma.key.findFirst({ where: { productId, isUsed: false } });
        if (keyToAssign) {
          await prisma.key.update({
            where: { id: keyToAssign.id },
            data: { isUsed: true, usedInOrderId: pendingOrder.id }
          });
          await prisma.order.update({
            where: { id: pendingOrder.id },
            data: { status: 'completed' }
          });

          bot.sendMessage(msg.chat.id,
            `🎉 Ключ автоматически выдан покупателю!\n👤 ${pendingOrder.user.email}`
          );

          if (pendingOrder.user.telegramId) {
            const { notifyKeyReady } = await import('./customer');
          await notifyKeyReady(
  pendingOrder.user.telegramId,
  code,
  pendingOrder.product.platform.name,
  pendingOrder.product.platform.slug,  // 👈 добавили
  `${pendingOrder.product.amount} ${pendingOrder.product.region.currency}`,
  pendingOrder.id
);await notifyKeyReady(
  pendingOrder.user.telegramId,
  code,
  pendingOrder.product.platform.name,
  pendingOrder.product.platform.slug,  // 👈 добавили
  `${pendingOrder.product.amount} ${pendingOrder.product.region.currency}`,
  pendingOrder.id
);
          }
        }
      }
    } catch (err) {
      console.error('Ошибка addkey:', err);
      bot.sendMessage(msg.chat.id, '❌ Ошибка при добавлении ключа');
    }
  });

  bot.onText(/\/keys (\S+)/, async (msg: Message, match: RegExpExecArray | null) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const productId = match![1].trim();
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { platform: true, region: true }
      });
      if (!product) return bot.sendMessage(msg.chat.id, '❌ Продукт не найден');
      const free = await prisma.key.count({ where: { productId, isUsed: false } });
      const used = await prisma.key.count({ where: { productId, isUsed: true } });
      bot.sendMessage(msg.chat.id,
        `🔑 Ключи: ${product.platform.name} ${product.region.flag} ${product.amount} ${product.region.currency}\n\n✅ Свободных: ${free}\n❌ Использованных: ${used}`
      );
    } catch (err) {
      bot.sendMessage(msg.chat.id, '❌ Ошибка');
    }
  });

  bot.onText(/\/products/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const products = await prisma.product.findMany({
      include: { platform: true, region: true },
      orderBy: [{ platformId: 'asc' }]
    });
    const lines = products.map(p =>
      `${p.platform.name} ${p.region.flag} ${p.amount} ${p.region.currency}\n${p.id}`
    ).join('\n\n');
    bot.sendMessage(msg.chat.id, `📦 Продукты:\n\n${lines}`);
  });

  bot.onText(/\/reviews/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const reviews = await prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true, order: { include: { product: { include: { platform: true, region: true } } } } }
    });
    if (reviews.length === 0) return bot.sendMessage(msg.chat.id, 'Отзывов пока нет');
    const text = reviews.map(r =>
      `${'⭐'.repeat(r.rating)} ${r.rating}/5\n👤 ${r.user.email}\n🎮 ${r.order.product.platform.name} ${r.order.product.region.flag}\n${r.comment ? `💬 ${r.comment}` : ''}`.trim()
    ).join('\n\n');
    bot.sendMessage(msg.chat.id, `⭐ Последние отзывы:\n\n${text}`);
  });

  console.log('🤖 Admin бот запущен');
};