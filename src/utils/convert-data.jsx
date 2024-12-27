/**
 * Конвертирует данные с категориями из Strapi в формат для графиков Recharts
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @returns {Array<{date:string, [category:string]:number, ...}>} - данные в формате для Recharts
 */
export const convertCategorizedData = (data) => {
  const newData = {};
  data.forEach((item) => {
    const key = item.date;

    if (!newData[key]) {
      newData[key] = {};
    }

    newData[key][item.category.name] = Number(item.sum);
  });

  return Object.entries(newData).map(([key, values]) => ({
    date: key,
    ...values,
  }));
};
