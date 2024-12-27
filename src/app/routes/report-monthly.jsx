import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../features/total";
import { BlogText } from "../../features/blog-text";
import { calculateTotal, calculateAverage } from "../../utils/calc";

export const MonthlyReportLoader = async ({ params }) => {
  const query = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year}-${params.month}-01`,
        $lte: `${params.year}-${params.month}-28`,
      },
    },
    sort: "sum:desc",
    pagination: {
      pageSize: 100,
    },
  });

  const annualQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year}-01-01`,
        $lte: `${params.year}-12-28`,
      },
    },
    sort: "date:desc",
    pagination: {
      pageSize: 1000,
    },
  });

  const yearAgoQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year - 1}-${params.month}-01`,
        $lte: `${params.year - 1}-${params.month}-28`,
      },
    },
    sort: "sum:desc",
    pagination: {
      pageSize: 100,
    },
  });

  const [
    expensesResponse,
    incomeResponse,
    annualExpensesResponse,
    annualIncomeResponse,
    yearAgoExpensesResponse,
    yearAgoIncomeResponse,
  ] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${annualQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${annualQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${yearAgoQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${yearAgoQuery}`),
  ]);

  const [
    expensesData,
    incomeData,
    annualExpensesData,
    annualIncomeData,
    yearAgoExpensesData,
    yearAgoIncomeData,
  ] = await Promise.all([
    expensesResponse.json(),
    incomeResponse.json(),
    annualExpensesResponse.json(),
    annualIncomeResponse.json(),
    yearAgoExpensesResponse.json(),
    yearAgoIncomeResponse.json(),
  ]);

  return {
    year: params.year,
    month: params.month,
    expenses: expensesData.data,
    income: incomeData.data,
    annualExpenses: annualExpensesData.data,
    annualIncome: annualIncomeData.data,
    yearAgoExpenses: yearAgoExpensesData.data,
    yearAgoIncome: yearAgoIncomeData.data,
  };
};

export const MonthlyReportRoute = () => {
  const {
    year,
    month,
    expenses,
    income,
    annualExpenses,
    annualIncome,
    yearAgoExpenses,
    yearAgoIncome,
  } = useLoaderData();

  const monthName = new Intl.DateTimeFormat("ru", {
    month: "long",
  }).format(new Date(year, month - 1, 1));

  // Записи отсортированы по дате. Берём последнюю дату, чтобы узнать общее количество месяцев,
  // за которые есть записи. Это понадобится для расчёта средних значений
  const lastDate = new Date(annualIncome[0].date);

  // Считаем общие доходы и расходы за месяц
  const totalIncome = calculateTotal(income);
  const totalExpenses = calculateTotal(expenses);

  // Считаем общие доходы и расходы за этот месяц в прошлом году
  const yearAgoTotalIncome = calculateTotal(yearAgoIncome);
  const yearAgoTotalExpenses = calculateTotal(yearAgoExpenses);

  // Считаем средние доходы и расходы в году
  const averageIncome = calculateAverage(annualIncome, lastDate.getMonth() + 1);
  const averageExpenses = calculateAverage(
    annualExpenses,
    lastDate.getMonth() + 1
  );

  // Считаем сколько сохранили
  const savings = totalIncome - totalExpenses;

  // Считаем процент сохранений
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

  return (
    <>
      <h1 className="first capitalize">
        {monthName} {year}
      </h1>
      <div className="cards">
        <Total
          value={totalIncome}
          yearAgo={yearAgoTotalIncome}
          average={averageIncome}
          averageYear={year}
          title="Доходы"
        />
        <Total
          value={totalExpenses}
          yearAgo={yearAgoTotalIncome}
          average={averageExpenses}
          averageYear={year}
          title="Расходы"
          invert
        />
        <Total value={savings} title="Сохранили" />
        <Total value={savingsRate} title="Процент сохранений" type="percent" />
      </div>
      <div className="card">
        <h2 className="first">Бюджет</h2>
      </div>
      <BlogText
        expenses={expenses}
        income={income}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        savings={savings}
        savingsRate={savingsRate}
      />
    </>
  );
};
