/**
 * Конвертирует данные из Strapi в формат для графиков Recharts
 * Возвращает таблицу с датами, категориями и суммами
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @returns {Array<{date:string, [category:string]:number, ...}>} - данные в формате для Recharts
 */
export const convertCategorizedTimeline = (data) => {
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

/**
 * Конвертирует данные из Strapi в формат для графиков Recharts
 * Возвращает массив с датами и общими суммами всех категорий
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @returns {Array<{date:string, value:number}>} - данные в формате для Recharts
 */
export const convertTotalsTimeline = (data) => {
  const newData = {};
  data.forEach((item) => {
    const key = item.date;

    if (!newData[key]) {
      newData[key] = 0;
    }

    newData[key] += Number(item.sum);
  });
  return Object.entries(newData).map(([key, value]) => ({
    date: key,
    value,
  }));
};

/**
 * Конвертирует данные из Strapi в формат для графиков Recharts
 * Возвращает массив с категориями и суммами
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @returns {Array<{id:number, name:string, sum:number}>} - данные в формате для Recharts
 */
export const convertCategories = (data) => {
  return data.map((item) => ({
    id: item.category.id,
    name: item.category.name,
    sum: item.sum,
  }));
};

/**
 * Конвертирует данные из Strapi в формат для графиков Recharts
 * Возвращает массив с категориями и средними суммами
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @returns {Array<{id:number, name:string, sum:number}>} - данные в формате для Recharts
 */
export const convertCategoriesAverages = (data) => {
  return data
    .reduce((acc, item) => {
      const categoryIndex = acc.findIndex(
        (category) => category.id === item.category.id
      );
      if (categoryIndex === -1) {
        acc.push({
          id: item.category.id,
          name: item.category.name,
          sum: item.sum,
          count: 1,
        });
      } else {
        acc[categoryIndex].sum += item.sum;
        acc[categoryIndex].count += 1;
      }
      return acc;
    }, [])
    .map((category) => ({
      id: category.id,
      name: category.name,
      sum: category.sum / category.count,
    }));
};
