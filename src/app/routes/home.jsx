import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../features/total";
import { YearLinks } from "../../features/report-links";
import { AssetsChart } from "../../features/assets-chart";
import { InvestIncomeChart } from "../../features/invest-income-chart";
import { CategoryChart } from "../../features/income-expenses-chart";
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
    expensesCategoriesResponse,
    incomeCategoriesResponse,
    assetCategoriesResponse,
  ] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}assets?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expense-categories`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}income-categories`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}asset-categories`),
  ]);

  const [
    expensesData,
    incomeData,
    assetsData,
    expensesCategoriesData,
    incomeCategoriesData,
    assetCategoriesData,
  ] = await Promise.all([
    expensesResponse.json(),
    incomeResponse.json(),
    assetsResponse.json(),
    expensesCategoriesResponse.json(),
    incomeCategoriesResponse.json(),
    assetCategoriesResponse.json(),
  ]);

  return {
    expenses: expensesData.data,
    income: incomeData.data,
    assets: assetsData.data,
    expensesCategories: expensesCategoriesData.data,
    incomeCategories: incomeCategoriesData.data,
    assetCategories: assetCategoriesData.data,
  };
};

export const HomeRoute = () => {
  const {
    expenses,
    income,
    assets,
    expensesCategories,
    incomeCategories,
    assetCategories,
  } = useLoaderData();

  // Активы отсортированы по дате, берём последнюю дату для фильтра
  const lastDateString = assets[assets.length - 1].date;
  const lastDate = new Date(lastDateString);

  // Формируем дату на месяц назад
  const monthAgoDate = new Date(
    lastDate.getFullYear(),
    lastDate.getMonth() - 1,
    "1"
  );

  // Считаем общие активы за последний месяц
  const lastAssets = assets.filter((asset) => asset.date === lastDateString);
  const totalAssets = calculateTotal(lastAssets);

  // Считаем общие активы за предыдущий месяц для сравнения
  const monthAgoAssets = assets.filter((asset) => {
    const assetDate = new Date(asset.date);
    return (
      assetDate.getFullYear() === monthAgoDate.getFullYear() &&
      assetDate.getMonth() === monthAgoDate.getMonth()
    );
  });
  const monthAgoTotalAssets = calculateTotal(monthAgoAssets);

  // Считаем инвестиционные активы за последний месяц
  const lastInvestAssets = lastAssets.filter(
    (asset) => asset.category.isInvest
  );
  const totalInvestAssets = calculateTotal(lastInvestAssets);

  // Считаем инвестиционные активы за предыдущий месяц для сравнения
  const monthAgoInvestAssets = assets.filter((asset) => {
    const assetDate = new Date(asset.date);
    return (
      assetDate.getFullYear() === monthAgoDate.getFullYear() &&
      assetDate.getMonth() === monthAgoDate.getMonth() &&
      asset.category.isInvest
    );
  });
  const monthAgoTotalInvestAssets = calculateTotal(monthAgoInvestAssets);

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
        <Total
          value={totalAssets}
          monthAgo={monthAgoTotalAssets}
          title="Активы"
        />
        <Total
          value={totalInvestAssets}
          monthAgo={monthAgoTotalInvestAssets}
          title="Инвестиции"
        />
        <Total value={0} title="FIRE в месяцах" />
        <Total
          value={averageLastYearInvestIncome}
          title="Средний инвест. доход"
        />
      </div>
      <div className="card">
        <h2 className="first">Классы активов</h2>
        <div className="card__cutoff">
          <AssetsChart data={assets} categories={assetCategories} />
        </div>
      </div>
      <h2>Годовые отчеты</h2>
      <YearLinks />
      <div className="card">
        <h2 className="first">Инвестиционный доход</h2>
        <InvestIncomeChart data={income} />
      </div>
      <div className="card">
        <h2 className="first">FIRE в месяцах</h2>
      </div>
      <div className="card">
        <h2 className="first">Процент сохранений</h2>
      </div>
      <div className="card">
        <h2 className="first">Доходы</h2>
        <CategoryChart
          data={income}
          categories={incomeCategories}
          colorScheme="income"
        />
      </div>
      <div className="card">
        <h2 className="first">Расходы</h2>
        <CategoryChart
          data={expenses}
          categories={expensesCategories}
          colorScheme="expenses"
        />
      </div>
    </>
  );
};
