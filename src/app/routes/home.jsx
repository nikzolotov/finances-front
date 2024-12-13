import { useLoaderData } from "react-router-dom";
import qs from "qs";

export const homeLoader = async () => {
  const expensesQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
  });
  // const tagsQuery = qs.stringify({
  //   sort: "name:asc",
  //   filters: {
  //     isMain: true,
  //   },
  // });
  const [expensesResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${expensesQuery}`),
    // fetch(`${import.meta.env.VITE_STRAPI_API_URL}tags?${tagsQuery}`),
  ]);
  const [expensesData] = await Promise.all([
    expensesResponse.json(),
    // tagsResponse.json(),
  ]);
  return {
    expenses: expensesData.data,
    // observationsTotal: observationsData.meta.pagination.total,
    // tags: tagsData.data,
  };
};

export const HomeRoute = () => {
  const { expenses } = useLoaderData();
  return <ExpensesTmp data={expenses} />;
};

const ExpensesTmp = ({ data }) => {
  return (
    <ul>
      {data.map((expense) => (
        <li key={expense.id}>
          {expense.date} - {expense.sum} - {expense.category.name}
        </li>
      ))}
    </ul>
  );
};
