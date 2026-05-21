import prisma from '../lib/prisma';


export const getRates = async () => {
  const currencies = await prisma.currency.findMany();
  return currencies;
};

export const getRate = async (code: string) => {
  const currency = await prisma.currency.findUnique({
    where: { code }
  });
  return currency;
};

export const updateRate = async (code: string, rate: number) => {
  const currency = await prisma.currency.upsert({
    where: { code },
    update: { rate, updatedAt: new Date() },
    create: { code, rate, markup: 0.10 }
  });
  return currency;
};
