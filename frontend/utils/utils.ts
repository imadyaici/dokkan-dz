export const formatDate = (date: Date | number) => {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};

const formatters = {
  ar: new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: 'DZD',
  }),
  fr: new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
  }),
};

export const formatMoney = (amount: number, lang: string = 'fr') => {
  const formatter = lang === 'ar' ? formatters.ar : formatters.fr;
  return formatter.format(amount);
};
