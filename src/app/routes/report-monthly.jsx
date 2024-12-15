import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../components/total";
import { BlogText } from "../../components/blog-text";

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
  });

  const [expensesResponse, incomeResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
  ]);

  const [expensesData, incomeData] = await Promise.all([
    expensesResponse.json(),
    incomeResponse.json(),
  ]);

  return {
    year: params.year,
    month: params.month,
    expenses: expensesData.data,
    income: incomeData.data,
  };
};

export const MonthlyReportRoute = () => {
  const { year, month, expenses, income } = useLoaderData();

  const monthName = new Intl.DateTimeFormat("ru", {
    month: "long",
  }).format(new Date(year, month - 1, 1));

  const totalIncome = income.reduce((acc, expense) => acc + expense.sum, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.sum, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

  return (
    <>
      <h1 className="first capitalize">
        {monthName} {year}
      </h1>
      <div className="cards">
        <Total value={totalIncome} title="Доходы" />
        <Total value={totalExpenses} title="Расходы" />
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
