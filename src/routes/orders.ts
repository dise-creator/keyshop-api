import { Router } from "express";
import prisma from "../lib/prisma";
import { calculatePrice } from "../services/pricing";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcrypt";
import { sendOrderEmail } from "../services/email";
import { notifyAdminNewOrder, notifyLowStock } from "../bot/admin";
import { sendKeyToTelegram } from "../bot/customer";

const router = Router();

const LOW_STOCK_THRESHOLD = 3;

router.post("/", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.userId!.toString();

    if (!productId) {
      res.status(400).json({ error: "productId is required" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { region: true },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const currency = await prisma.currency.findUnique({
      where: { code: product.region.currency },
    });

    if (!currency) {
      res.status(400).json({ error: "Currency rate not found" });
      return;
    }

    const amountRub = calculatePrice(product.amount, currency.rate, currency.markup);

    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        amountRub,
        rate: currency.rate,
        markup: currency.markup,
        status: "pending",
      },
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      include: {
        product: { include: { platform: true, region: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        product: { include: { platform: true, region: true } },
      },
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.post("/guest", async (req, res, next) => {
  try {
    const { email, productId } = req.body;

    if (!email || !productId) {
      res.status(400).json({ error: "email and productId are required" });
      return;
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const password = await bcrypt.hash(Math.random().toString(36), 10);
      user = await prisma.user.create({
        data: { email, password, role: "user" },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { region: true, platform: true },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const currency = await prisma.currency.findUnique({
      where: { code: product.region.currency },
    });

    if (!currency) {
      res.status(400).json({ error: "Currency rate not found" });
      return;
    }

    const amountRub = calculatePrice(product.amount, currency.rate, currency.markup);

    const freeKey = await prisma.key.findFirst({
      where: { productId, isUsed: false },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        productId,
        amountRub,
        rate: currency.rate,
        markup: currency.markup,
        status: freeKey ? "completed" : "pending",
      },
    });

    if (freeKey) {
      await prisma.key.update({
        where: { id: freeKey.id },
        data: { isUsed: true, usedInOrderId: order.id },
      });
    }

    // Email
    try {
      await sendOrderEmail(
        email,
        freeKey ? freeKey.code : null,
        product.platform.name,
        `${product.amount} ${product.region.currency}`,
        amountRub
      );
    } catch (emailErr) {
      console.error("Ошибка отправки email:", emailErr);
    }

    // Уведомление покупателю в Telegram
    if (freeKey && user.telegramId) {
      try {
        await sendKeyToTelegram(
          user.telegramId,
          freeKey.code,
          product.platform.name,
          `${product.amount} ${product.region.currency}`,
          amountRub,
          order.id
        );
      } catch (tgErr) {
        console.error("Ошибка отправки ключа в Telegram:", tgErr);
      }
    }

    // Уведомление админу
    try {
      await notifyAdminNewOrder(
        email,
        product.platform.name,
        `${product.amount} ${product.region.currency}`,
        amountRub,
        !!freeKey
      );
    } catch (err) {
      console.error("Ошибка уведомления админа:", err);
    }

    // Проверка остатков
    if (freeKey) {
      try {
        const remaining = await prisma.key.count({ where: { productId, isUsed: false } });
        if (remaining <= LOW_STOCK_THRESHOLD) {
          await notifyLowStock(
            product.platform.name,
            `${product.amount}`,
            product.region.currency,
            remaining
          );
        }
      } catch (err) {
        console.error("Ошибка проверки остатков:", err);
      }
    }

    res.status(201).json({
      order,
      userId: user.id,
      key: freeKey ? freeKey.code : null,
      hasKey: !!freeKey,
    });
  } catch (err) {
    next(err);
  }
});

export { router as ordersRouter };