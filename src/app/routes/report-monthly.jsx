import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../components/total";

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

  return (
    <>
      <h1>
        {monthName} {year}
      </h1>
      <div className="cards">
        <Total value={totalIncome} title="Доходы" />
        <Total value={totalExpenses} title="Расходы" />
        <Total value={totalIncome - totalExpenses} title="Сохранили" />
        <Total
          value={((totalIncome - totalExpenses) / totalIncome) * 100}
          title="Процент сохранений"
        />
      </div>
      <div className="card">
        <h2>Бюджет</h2>
      </div>
      <div className="card">
        <h2>Текст для блога</h2>
        <h3>Расходы</h3>
        <ExpensesTmp data={expenses} />
        <h3>Доходы</h3>
        <ExpensesTmp data={income} />
        <h3>Итого</h3>
      </div>
    </>
  );
};

const ExpensesTmp = ({ data }) => {
  return (
    <ul>
      {data && data.length > 0 ? (
        data.map((expense) => (
          <li key={expense.id}>
            - {expense.category.name} — {expense.sum.toLocaleString("ru-RU")} ₽
          </li>
        ))
      ) : (
        <li>No expenses available</li>
      )}
    </ul>
  );
};
