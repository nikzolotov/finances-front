import { calculateTotal } from "./calc";

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
 * Возвращает массив с категориями, суммами и бюджетами
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @param {Array<{year:string, category:{name:string}, sum:number}>} budgetData - данные из Strapi
 * @returns {Array<{id:number, name:string, sum:number}>} - данные в формате для Recharts
 */
export const convertCategories = (data, budgetData) => {
  return data.map((item) => ({
    id: item.category.id,
    name: item.category.name,
    sum: item.sum,
    budget: budgetData.filter(
      (budgetItem) => budgetItem.category.id === item.category.id
    )[0].sum,
  }));
};

/**
 * Конвертирует данные из Strapi в формат для графиков Recharts
 * Возвращает массив с категориями и средними суммами
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @param {Array<{year:string, category:{name:string}, sum:number}>} budgetData - данные из Strapi
 * @returns {Array<{id:number, name:string, sum:number}>} - данные в формате для Recharts
 */
export const convertCategoriesAverages = (data, budgetData) => {
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
      budget: budgetData.filter(
        (budgetItem) => budgetItem.category.id === category.id
      )[0].sum,
    }));
};

/**
 * Конвертирует данные из Strapi в формат для Sankey
 * @param {Array<{date:string, category:{name:string}, sum:number}>} income - данные из Strapi
 * @param {Array<{date:string, category:{name:string}, sum:number}>} expenses - данные из Strapi
 * @returns {Object<{nodes:[], links:[]}>} - данные в формате для Sankey
 */
export const convertAnnualSankey = (income, expenses) => {
  const incomeTotals = income.reduce((acc, item) => {
    const categoryIndex = acc.findIndex(
      (category) => category.name === item.category.name
    );
    if (categoryIndex === -1) {
      acc.push({
        name: item.category.name,
        sum: item.sum,
      });
    } else {
      acc[categoryIndex].sum += item.sum;
    }
    // Удаляем нулевые категории, из-за них Sankey падает
    if (acc[categoryIndex] !== undefined && acc[categoryIndex].sum === 0) {
      acc.splice(categoryIndex, 1);
    }
    return acc;
  }, []);

  const expensesTotals = expenses.reduce((acc, item) => {
    const categoryIndex = acc.findIndex(
      (category) => category.name === item.category.name
    );
    if (categoryIndex === -1) {
      acc.push({
        name: item.category.name,
        sum: item.sum,
      });
    } else {
      acc[categoryIndex].sum += item.sum;
    }
    // Удаляем нулевые категории, из-за них Sankey падает
    if (acc[categoryIndex] !== undefined && acc[categoryIndex].sum === 0) {
      acc.splice(categoryIndex, 1);
    }
    return acc;
  }, []);

  const totalIncome = calculateTotal(incomeTotals);
  const totalExpenses = calculateTotal(expensesTotals);
  const totalSavings = totalIncome - totalExpenses;

  return {
    nodes: [
      ...incomeTotals,
      {
        name: "Доходы",
      },
      {
        name: "Расходы",
      },
      ...expensesTotals,
      {
        name: "Сохранения",
      },
    ],
    links: [
      ...incomeTotals.map((item) => ({
        source: incomeTotals.indexOf(item),
        target: incomeTotals.length,
        value: item.sum,
      })),
      {
        source: incomeTotals.length,
        target: incomeTotals.length + 1,
        value: totalExpenses,
      },
      ...expensesTotals.map((item) => ({
        source: incomeTotals.length + 1,
        target: incomeTotals.length + 2 + expensesTotals.indexOf(item),
        value: item.sum,
      })),
      {
        source: incomeTotals.length,
        target: incomeTotals.length + expensesTotals.length + 2,
        value: totalSavings,
      },
    ],
  };
};
