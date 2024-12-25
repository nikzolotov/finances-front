import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../components/total";
import { YearLinks } from "../../components/report-links";
import { calculateTotal, calculateAverage } from "../../utils/calc";

import MyAreaChart from "../../components/area-chart";
import BarChart from "../../components/bar-chart";

import assets2 from "./assets.json";
import assetCategories2 from "./assets-categories.json";
import income2 from "./income.json";
import incomeCategories from "./income-categories.json";
import expenses2 from "./expenses.json";
import expenseCategories from "./expenses-categories.json";
import currencies from "./currencies2.json";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const homeLoader = async ({ params }) => {
  const query = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    sort: "date:desc",
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
  const lastDateString = assets[0].date;
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

  // Подготовка данных для постороения графиков d3
  // Собираем активы в формат {date:"", 1:"", 2:"", ...}, где 1,2 — это id категорий

  const uniqueAssetDates = new Set();
  const assetsTable = [];

  assets.forEach((asset) => {
    uniqueAssetDates.add(asset.date);
  });

  uniqueAssetDates.forEach((date) => {
    const values = { cat1: 100, cat2: 200, cat3: 150 };
    // const values = [];
    // assetCategories.forEach((category) => {
    //   values.push({
    //     cat${category}:
    //   });
    // });

    assetsTable.push({ date: date, ...values });
  });

  const tmpData = [
    { name: "Page A", uv: 2900, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 500, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2800, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 200, pv: 5800, amt: 2290 },
    { name: "Page F", uv: 2200, pv: 5800, amt: 2290 },
    { name: "Page G", uv: 1500, pv: 4300, amt: 2100 },
    { name: "Page H", uv: 2400, pv: 3400, amt: 2500 },
    { name: "Page I", uv: 900, pv: 1200, amt: 1800 },
    { name: "Page J", uv: 1100, pv: 2200, amt: 2000 },
    { name: "Page K", uv: 3000, pv: 5000, amt: 2600 },
  ];

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
      {/* <div className="card">
        <MyAreaChart
          data={assets2.assets}
          series={assetCategories2.categories}
        />
      </div> */}
      <div className="card">
        <h2 className="first">Классы активов</h2>
        <div class="card__cutoff" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={assets2.assets} margin={0}>
              <Area
                type="monotone"
                dataKey="estate"
                stackId="1"
                fill="#0347CE"
                fillOpacity="1"
                stroke="none"
              />
              <Area
                type="monotone"
                dataKey="stocks"
                stackId="1"
                fill="#AC54FA"
                fillOpacity="1"
                stroke="none"
              />
              <Area
                type="monotone"
                dataKey="cash"
                stackId="1"
                fill="#FFD24A"
                fillOpacity="1"
                stroke="none"
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
