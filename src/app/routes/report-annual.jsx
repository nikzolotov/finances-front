import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../features/total";
import { MonthLinks } from "../../features/report-links";
import { calculateTotal } from "../../utils/calc";

export const AnnualReportLoader = async ({ params }) => {
  const query = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year}-01-01`,
        $lte: `${params.year}-12-28`,
      },
    },
    sort: "sum:desc",
    pagination: {
      pageSize: 1000,
    },
  });

  const yearAgoQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year - 1}-01-01`,
        $lte: `${params.year - 1}-12-28`,
      },
    },
    sort: "sum:desc",
    pagination: {
      pageSize: 1000,
    },
  });

  const [
    expensesResponse,
    incomeResponse,
    yearAgoExpensesResponse,
    yearAgoIncomeResponse,
  ] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${yearAgoQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${yearAgoQuery}`),
  ]);

  const [expensesData, incomeData, yearAgoExpensesData, yearAgoIncomeData] =
    await Promise.all([
      expensesResponse.json(),
      incomeResponse.json(),
      yearAgoExpensesResponse.json(),
      yearAgoIncomeResponse.json(),
    ]);

  return {
    year: params.year,
    expenses: expensesData.data,
    income: incomeData.data,
    yearAgoExpenses: yearAgoExpensesData.data,
    yearAgoIncome: yearAgoIncomeData.data,
  };
};

export const AnnualReportRoute = () => {
  const { year, expenses, income, yearAgoExpenses, yearAgoIncome } =
    useLoaderData();

  // Считаем общие доходы и расходы
  const totalIncome = calculateTotal(income);
  const totalExpenses = calculateTotal(expenses);

  // Считаем общие доходы и расходы в прошлом году
  const yearAgoTotalIncome = calculateTotal(yearAgoIncome);
  const yearAgoTotalExpenses = calculateTotal(yearAgoExpenses);

  // Считаем сколько сохранили
  const savings = totalIncome - totalExpenses;

  // Считаем процент сохранений
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

  return (
    <>
      <h1 className="first">{year} год</h1>
      <div className="cards">
        <Total
          value={totalIncome}
          yearAgo={yearAgoTotalIncome}
          title="Доходы"
        />
        <Total
          value={totalExpenses}
          yearAgo={yearAgoTotalExpenses}
          title="Расходы"
          invert
        />
        <Total value={savings} title="Сохранили" />
        <Total value={savingsRate} title="Процент сохранений" type="percent" />
      </div>
      <div className="card">
        <h2 className="first">Денежные потоки</h2>
      </div>
      <h2>Месячные отчеты</h2>
      <MonthLinks year={year} />
      <div className="card">
        <h2 className="first">Бюджет</h2>
      </div>
    </>
  );
};
