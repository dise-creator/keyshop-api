export const calculatePrice = (
  amount: number,
  rate: number,
  markup: number
): number => {
  return Math.round(amount * rate * (1 + markup));
};
