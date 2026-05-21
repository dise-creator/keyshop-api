import { Router } from 'express';
import prisma from '../lib/prisma';
import { calculatePrice } from '../services/pricing';

const router = Router();

// Получить все продукты с ценой в рублях
router.get('/', async (req, res, next) => {
  try {
    const { platformId, regionId } = req.query;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(platformId && { platformId: String(platformId) }),
        ...(regionId && { regionId: String(regionId) }),
      },
      include: {
        platform: true,
        region: true,
      }
    });

    const currencies = await prisma.currency.findMany();
    const rateMap = Object.fromEntries(
      currencies.map(c => [c.code, { rate: c.rate, markup: c.markup }])
    );

    const result = products.map(product => {
      const currencyData = rateMap[product.region.currency];
      const priceRub = currencyData
        ? calculatePrice(product.amount, currencyData.rate, currencyData.markup)
        : null;

      return {
        ...product,
        priceRub,
        rate: currencyData?.rate ?? null,
        markup: currencyData?.markup ?? null,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Получить один продукт по id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { platform: true, region: true }
    });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export { router as productsRouter };
