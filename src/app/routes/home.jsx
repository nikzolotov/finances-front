import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../components/total";
import { YearLinks } from "../../components/report-links";
import { calculateTotal, calculateAverage } from "../../utils/calc";

export const homeLoader = async ({ params }) => {
  const query = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    sort: "date:desc",
    pagination: {
      pageSize: 10000,
    },
  });

  const [expensesResponse, incomeResponse, assetsResponse] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}assets?${query}`),
  ]);

  const [expensesData, incomeData, assetsData] = await Promise.all([
    expensesResponse.json(),
    incomeResponse.json(),
    assetsResponse.json(),
  ]);

  return {
    year: params.year,
    expenses: expensesData.data,
    income: incomeData.data,
    asssets: assetsData.data,
  };
};

export const HomeRoute = () => {
  const { expenses, income, asssets } = useLoaderData();

  // Активы отсортированы по дате, берём последнюю дату для фильтра
  const lastDateString = asssets[0].date;
  const lastDate = new Date(lastDateString);

  // Считаем общие активы за последний месяц
  const lastAssets = asssets.filter((asset) => asset.date === lastDateString);
  const totalAssets = calculateTotal(lastAssets);

  // Считаем инвестиционные активы за последний месяц
  const lastInvestAssets = asssets.filter(
    (asset) => asset.date === lastDateString && asset.category.isInvest
  );
  const totalInvestAssets = calculateTotal(lastInvestAssets);

  // Считаем средний инвестиционный доход за последний год
  const lastYearInvestIncome = income.filter(
    (item) =>
      new Date(item.date).getFullYear() === lastDate.getFullYear() &&
      item.category.isInvest
  );
  const averageLastYearInvestIncome = calculateAverage(
    lastYearInvestIncome,
    lastDate.getMonth() + 1
  );

  return (
    <>
      <h1>Все финансы</h1>
      <div className="cards">
        <Total value={Math.floor(totalAssets)} title="Активы" />
        <Total value={Math.floor(totalInvestAssets)} title="Инвестиции" />
        <Total value={0} title="FIRE в месяцах" />
        <Total
          value={Math.floor(averageLastYearInvestIncome)}
          title="Средний инвест. доход"
        />
      </div>
      <div className="card">
        <h2 className="first">Классы активов</h2>
      </div>
      <h2>Годовые отчеты</h2>
      <YearLinks />
      <div className="card">
        <h2 className="first">Инвестиционный доход</h2>
      </div>
      <div className="card">
        <h2 className="first">FIRE в месяцах</h2>
      </div>
      <div className="card">
        <h2 className="first">Процент сохранений</h2>
      </div>
      <div className="card">
        <h2 className="first">Доходы</h2>
      </div>
      <div className="card">
        <h2 className="first">Расходы</h2>
      </div>
    </>
  );
};
