import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../features/total";
import { YearLinks } from "../../features/report-links";
import { AssetsChart } from "../../features/assets-chart";
import { InvestIncomeChart } from "../../features/invest-income-chart";
import { calculateTotal, calculateAverage } from "../../utils/calc";
import "../../components/recharts/recharts.css";

export const homeLoader = async ({ params }) => {
  const query = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    sort: "date:asc",
    pagination: {
      pageSize: 10000,
    },
  });

  const [
    expensesResponse,
    incomeResponse,
    assetsResponse,
    assetCategoriesResponse,
  ] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}assets?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}asset-categories`),
  ]);

  const [expensesData, incomeData, assetsData, assetCategoriesData] =
    await Promise.all([
      expensesResponse.json(),
      incomeResponse.json(),
      assetsResponse.json(),
      assetCategoriesResponse.json(),
    ]);

  return {
    expenses: expensesData.data,
    income: incomeData.data,
    assets: assetsData.data,
    assetCategories: assetCategoriesData.data,
  };
};

export const HomeRoute = () => {
  const { expenses, income, assets, assetCategories } = useLoaderData();

  // Активы отсортированы по дате, берём последнюю дату для фильтра
  const lastDateString = assets[assets.length - 1].date;
  const lastDate = new Date(lastDateString);

  // Считаем общие активы за последний месяц
  const lastAssets = assets.filter((asset) => asset.date === lastDateString);
  const totalAssets = calculateTotal(lastAssets);

  // Считаем инвестиционные активы за последний месяц
  const lastInvestAssets = lastAssets.filter(
    (asset) => asset.category.isInvest
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
        <Total value={totalAssets} title="Активы" />
        <Total value={totalInvestAssets} title="Инвестиции" />
        <Total value={0} title="FIRE в месяцах" />
        <Total
          value={averageLastYearInvestIncome}
          title="Средний инвест. доход"
        />
      </div>
      <div className="card">
        <h2 className="first">Классы активов</h2>
        <div className="card__cutoff" style={{ height: 300 }}>
          <AssetsChart data={assets} categories={assetCategories} />
        </div>
      </div>
      <h2>Годовые отчеты</h2>
      <YearLinks />
      <div className="card">
        <h2 className="first">Инвестиционный доход</h2>
        <div style={{ height: 300 }}>
          <InvestIncomeChart data={income} />
        </div>
      </div>
      <div className="card">
        <h2 className="first">FIRE в месяцах</h2>
      </div>
      <div className="card">
        <h2 className="first">Процент сохранений</h2>
      </div>
      <div className="card">
        <h2 className="first">Доходы</h2>
        {/* <BarChart
          title="Income"
          data={income2.income}
          series={incomeCategories.categories}
        /> */}
      </div>
      <div className="card">
        <h2 className="first">Расходы</h2>
        {/* <BarChart
          title="Expenses"
          data={expenses2.expenses}
          series={expenseCategories.categories.filter((d) => d.parent === null)}
        /> */}
      </div>
    </>
  );
};
