import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total, Difference } from "../../features/total";
import { YearLinks } from "../../features/report-links";
import { AssetsChart } from "../../features/assets-chart";
import { InvestIncomeChart } from "../../features/invest-income-chart";
import { FIREChart } from "../../features/fire-chart";
import { SavingsChart } from "../../features/savings-chart";
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
  const lastDate =
    expenses.length > 0
      ? new Date(expenses[expenses.length - 1].date)
      : new Date();

  // Формируем дату на месяц назад
  const monthAgoDate = new Date(
    lastDate.getFullYear(),
    lastDate.getMonth() - 1,
    "1"
  );

  // Считаем общие активы за последний месяц
  const lastAssets = assets.filter(
    (asset) => asset.date === lastDate.toISOString().slice(0, 10)
  );
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
        <Total value={totalAssets} title="Активы">
          <Difference
            value={totalAssets}
            comparisonValue={monthAgoTotalAssets}
            label="чем месяцем ранее"
            absolute
          />
        </Total>
        <Total value={totalInvestAssets} title="Инвестиции">
          <Difference
            value={totalInvestAssets}
            comparisonValue={monthAgoTotalInvestAssets}
            label="чем месяцем ранее"
          />
        </Total>
        <Total value={0} title="FIRE в месяцах" />
        <Total value={averageLastYearInvestIncome} title="Инвестиционный доход">
          <p className="total__difference total__empty">
            Средний за {lastDate.getFullYear()} год
          </p>
        </Total>
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
        <FIREChart assets={assets} expenses={expenses} />
      </div>
      <div className="card">
        <h2 className="first">Процент сохранений</h2>
        <SavingsChart income={income} expenses={expenses} />
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
