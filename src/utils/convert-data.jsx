import { calculateTotal, calculateMonthsDiff } from "./calc";

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
 * Возвращает массив с датами, средними расходами за 12 месяцев, предшествующих текущему
 * и количеством накопленных месяцев жизни (FIRE в средних месячных расходах)
 * @param {Array<{date:string, category:{name:string}, sum:number}>} assets - данные из Strapi
 * @param {Array<{date:string, category:{name:string}, sum:number}>} expenses - данные из Strapi
 * @returns {Array<{date:string, averageExpensesLTM:number, months:number}>} - данные в формате для Recharts
 */
export const convertFIRETimeline = (assets, expenses) => {
  const newData = {};

  // Считаем первую дату, за которую есть расходы
  // Она понадобится для расчёта средних значений для первых месяцев
  const firstDateString = expenses.reduce((earliest, item) => {
    return new Date(item.date) < new Date(earliest) ? item.date : earliest;
  }, expenses[0]?.date || null);
  const firstDate = new Date(firstDateString);

  // Формируем пустой объект с датами
  expenses.forEach((item) => {
    const key = item.date;

    if (!newData[key]) {
      newData[key] = { averageExpensesLTM: 0, months: 0 };
    }
  });

  Object.entries(newData).forEach(([key, item]) => {
    // Считаем средние расходы за 12 месяцев, включая текущий
    const LTMDate = new Date(key);
    LTMDate.setMonth(LTMDate.getMonth() - 11);
    const LTMDateString = LTMDate.toISOString().slice(0, 10);

    const expensesLTM = expenses.filter(
      (expense) => expense.date >= LTMDateString && expense.date <= key
    );

    let monthsDifference = Math.min(
      12,
      calculateMonthsDiff(firstDate, new Date(key)) + 1
    );

    item.averageExpensesLTM = calculateTotal(expensesLTM) / monthsDifference;

    // Считаем общую сумму инвестиционных активов за текущий месяц,
    // делим на средние расходы за 12 месяцев
    // и получаем количество месячных расходов, которые покрываает капитал
    const monthAssets = assets.filter(
      (asset) => asset.date === key && asset.category.isInvest
    );
    item.months = Math.round(
      calculateTotal(monthAssets) / item.averageExpensesLTM
    );
  });

  const result = Object.entries(newData).map(([key, values]) => ({
    date: key,
    ...values,
  }));

  return result;
};

/**
 * Конвертирует данные из Strapi в формат для графиков Recharts
 * Возвращает массив с датами, общими суммами доходов, расходов и процентами сбережений
 * @param {Array<{date:string, category:{name:string}, sum:number}>} income - данные из Strapi
 * @param {Array<{date:string, category:{name:string}, sum:number}>} expenses - данные из Strapi
 * @returns {Array<{date:string, income:number, expenses:number, savingsRate:number}>} - данные в формате для Recharts
 */
export const convertSavingsTimeline = (income, expenses) => {
  const convertedIncome = convertTotalsTimeline(income);
  const convertedExpenses = convertTotalsTimeline(expenses);

  const combinedData = {};

  convertedIncome.forEach((item) => {
    if (!combinedData[item.date]) {
      combinedData[item.date] = {
        date: item.date,
        income: 0,
        expenses: 0,
        savings: 0,
        savingsRate: 0,
      };
    }
    combinedData[item.date].income = item.value;
  });

  convertedExpenses.forEach((item) => {
    if (!combinedData[item.date]) {
      combinedData[item.date] = {
        date: item.date,
        income: 0,
        expenses: 0,
        savings: 0,
        savingsRate: 0,
      };
    }
    combinedData[item.date].expenses = item.value * -1; // расходы на графике отрицательные
  });

  Object.values(combinedData).forEach((entry) => {
    entry.savings = entry.income - entry.expenses * -1;
    entry.savingsRate =
      entry.income !== 0
        ? ((entry.income - entry.expenses * -1) / entry.income) * 100
        : 0;
  });

  return Object.values(combinedData);
};

/**
 * Конвертирует данные из Strapi в формат для графиков Recharts
 * Возвращает массив с категориями, суммами и бюджетами
 * @param {Array<{date:string, category:{name:string}, sum:number}>} data - данные из Strapi
 * @param {Array<{year:string, category:{name:string}, sum:number}>} budgetData - данные из Strapi
 * @returns {Array<{id:number, name:string, sum:number}>} - данные в формате для Recharts
 */
export const convertCategories = (data, budgetData) => {
  return data.map((item) => {
    const budgetItem = budgetData.find(
      (budget) => budget.category.id === item.category.id
    );
    return {
      id: item.category.id,
      name: item.category.name,
      sum: item.sum,
      budget: budgetItem ? budgetItem.sum : 0,
    };
  });
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
    .map((category) => {
      const budgetItem = budgetData.find(
        (item) => item.category.id === category.id
      );
      return {
        id: category.id,
        name: category.name,
        sum: category.sum / category.count,
        budget: budgetItem ? budgetItem.sum : 0,
      };
    });
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
        name: "Сохранили",
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
