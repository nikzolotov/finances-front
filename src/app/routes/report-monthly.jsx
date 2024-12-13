import { useLoaderData } from "react-router-dom";
import qs from "qs";

export const MonthlyReportLoader = async ({ params }) => {
  const expensesQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year}-${params.month}-01`,
        $lte: `${params.year}-${params.month}-28`,
      },
    },
  });
  const [expensesResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${expensesQuery}`),
  ]);
  const [expensesData] = await Promise.all([expensesResponse.json()]);

  return {
    year: params.year,
    month: params.month,
    expenses: expensesData.data,
  };
};

export const MonthlyReportRoute = () => {
  const { year, month, expenses } = useLoaderData();

  const monthName = new Intl.DateTimeFormat("ru", {
    month: "long",
  }).format(new Date(year, month - 1, 1));

  return (
    <>
      <h1>
        {monthName} {year}
      </h1>
      <h2>Расходы</h2>
      <ExpensesTmp data={expenses} />
    </>
  );
};

const ExpensesTmp = ({ data }) => {
  return (
    <ul>
      {data && data.length > 0 ? (
        data.map((expense) => (
          <li key={expense.id}>
            {expense.category.name} — {expense.sum.toLocaleString("ru-RU")} ₽
          </li>
        ))
      ) : (
        <li>No expenses available</li>
      )}
    </ul>
  );
};
