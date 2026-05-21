import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Получить все платформы
router.get('/', async (req, res, next) => {
  try {
    const platforms = await prisma.platform.findMany({
      where: { isActive: true }
    });
    res.json(platforms);
  } catch (err) {
    next(err);
  }
});

// Получить платформу по slug
router.get('/:slug', async (req, res, next) => {
  try {
    const platform = await prisma.platform.findUnique({
      where: { slug: req.params.slug },
      include: { products: true }
    });
    if (!platform) {
      res.status(404).json({ error: 'Platform not found' });
      return;
    }
    res.json(platform);
  } catch (err) {
    next(err);
  }
});

export { router as platformsRouter };
