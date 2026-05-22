import prisma from '../lib/prisma';
import { XMLParser } from 'fast-xml-parser';

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

export const fetchAndUpdateCbrRates = async () => {
  const response = await fetch('https://www.cbr.ru/scripts/XML_daily.asp');
  const xml = await response.text();

  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const valutas = parsed.ValCurs.Valute;

  // Нас интересуют только эти валюты
  const targets: Record<string, number> = {
    USD: 1,
    TRY: 1,
    KZT: 1,
    ARS: 1,
    INR: 1,
  };

  for (const valuta of valutas) {
    const code = valuta.CharCode;
    if (!(code in targets)) continue;

    // ЦБ даёт курс за Nominal единиц — нужно делить
    const nominal: number = valuta.Nominal;
    const rawRate: string = valuta.Value.replace(',', '.');
    const rate = parseFloat(rawRate) / nominal;

    await updateRate(code, parseFloat(rate.toFixed(4)));
    console.log(`✅ ${code}: ${rate.toFixed(4)} ₽`);
  }

  console.log('Курсы ЦБ обновлены');
};