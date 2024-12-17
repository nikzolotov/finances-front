import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../components/total";
import { YearLinks } from "../../components/report-links";

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
  const lastDate = asssets[0].date;

  // Суммируем активы за последний месяц
  const lastAssets = asssets.filter((asset) => asset.date === lastDate);
  const totalAssets = lastAssets.reduce(
    (acc, asset) => acc + parseFloat(asset.sum),
    0
  );

  // Суммируем инвестиционные активы за последний месяц
  const lastInvestAssets = asssets.filter(
    (asset) => asset.date === lastDate && asset.category.isInvest
  );
  const totalInvestAssets = lastInvestAssets.reduce(
    (acc, asset) => acc + parseFloat(asset.sum),
    0
  );

  return (
    <>
      <h1>Все финансы</h1>
      <div className="cards">
        <Total value={Math.floor(totalAssets)} title="Активы" />
        <Total value={Math.floor(totalInvestAssets)} title="Инвестиции" />
        <Total value={0} title="FIRE в месяцах" />
        <Total value={0} title="Инвестиционный доход" />
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
