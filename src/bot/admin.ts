import TelegramBot, { Message } from 'node-telegram-bot-api';
import prisma from '../lib/prisma';

let bot: TelegramBot;

export const initBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS || '').split(',').map(id => parseInt(id.trim())).filter(Boolean);

  bot = new TelegramBot(token, { polling: true });

  const isAdmin = (chatId: number) => adminIds.includes(chatId);
  const deny = (chatId: number) => bot.sendMessage(chatId, '⛔ Нет доступа');

  bot.onText(/\/start/, (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    bot.sendMessage(msg.chat.id, 
`👋 Привет! Я админ-бот KeyShop.

📦 Заказы
/orders — последние 10 заказов

💱 Курсы и наценки
/rates — курсы и наценки по валютам
/markup USD 0.15 — установить наценку (0.15 = 15%)
Валюты: USD, TRY, KZT, ARS

🎮 Платформы
/platforms — список платформ и статус
/platform playstation off — выключить платформу
/platform playstation on — включить платформу
Слаги: playstation, steam, ai-services, other

👥 Пользователи
/users — последние 10 пользователей
/ban <userId> — забанить пользователя

⚠️ Наценка от 0 до 1 (0.10 = 10%)`
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

  bot.onText(/\/platform (\w+) (on|off)/, async (msg: Message, match: RegExpExecArray | null) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const slug = match![1];
    const isActive = match![2] === 'on';
    const platform = await prisma.platform.update({ where: { slug }, data: { isActive } });
    bot.sendMessage(msg.chat.id, `${isActive ? '✅' : '❌'} Платформа ${platform.name} ${isActive ? 'включена' : 'выключена'}`);
  });

  bot.onText(/\/users/, async (msg: Message) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const users = await prisma.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
    const text = users.map(u =>
      `👤 ${u.email}\n🔑 ${u.role} | ${u.id.slice(0, 8)}`
    ).join('\n\n');
    bot.sendMessage(msg.chat.id, `👥 Пользователи:\n\n${text}`);
  });

  bot.onText(/\/ban (.+)/, async (msg: Message, match: RegExpExecArray | null) => {
    if (!isAdmin(msg.chat.id)) return deny(msg.chat.id);
    const userId = match![1].trim();
    await prisma.user.update({ where: { id: userId }, data: { role: 'BANNED' } });
    bot.sendMessage(msg.chat.id, `🚫 Пользователь ${userId.slice(0, 8)} заблокирован`);
  });

  console.log('🤖 Telegram бот запущен');
};