import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total } from "../../components/total";
import { YearLinks } from "../../components/report-links";
import { calculateTotal, calculateAverage } from "../../utils/calc";

import BarChart from "../../components/bar-chart";

import income2 from "./income.json";
import incomeCategories from "./income-categories.json";
import expenses2 from "./expenses.json";
import expenseCategories from "./expenses-categories.json";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  assetColors,
  investIncomeColor,
} from "../../components/recharts/color-schemes";
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

  // Подготовка данных для постороения графиков d3
  // Собираем активы в формат {date:"", Дом:"", Акции:"", ...}
  const assetsTable = assetsToRechartsData(assets);

  // Собираем инвестиционный доход в формат {date:"", value:""}
  const investIncome = income.filter((item) => item.category.isInvest);
  const investIncomeTable = investIncomeToRechartsData(investIncome);

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
      {/* <div className="card">
        <MyAreaChart
          data={assets2.assets}
          series={assetCategories2.categories}
        />
      </div> */}
      <div className="card">
        <h2 className="first">Классы активов</h2>
        <div className="card__cutoff" style={{ height: 300 }}>
          <AssetsGraph data={assetsTable} categories={assetCategories} />
        </div>
      </div>
      <h2>Годовые отчеты</h2>
      <YearLinks />
      <div className="card">
        <h2 className="first">Инвестиционный доход</h2>
        <div style={{ height: 300 }}>
          <InvestIncomeGraph data={investIncomeTable} />
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

const AssetsGraph = ({ data, categories }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={0} className="recharts-hide-active-dots">
        {categories.map((category) => (
          <Area
            key={category.id}
            type="monotone"
            dataKey={category.name}
            stackId="1"
            fill={assetColors[category.id - 1]}
            fillOpacity="1"
            stroke="none"
          />
        ))}
        <XAxis dataKey="date" hide={true} />
        <Tooltip offset={16} position={{ y: 4 }} content={<CustomTooltip />} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const InvestIncomeGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: -2, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          padding={{ left: 16, right: 16 }}
          tickLine={false}
          tickMargin={4}
          minTickGap={0}
          tickFormatter={(date) => {
            const dateObject = new Date(date);
            const month = dateObject.getMonth();
            const year = dateObject.getFullYear();
            return month === 0 ? `${year}` : "";
          }}
        />
        <YAxis
          padding={{ top: 16 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) =>
            value === 0 ? "" : `${(value / 1000).toFixed(0)} k`
          }
        />
        <Tooltip offset={16} position={{ y: 16 }} content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={investIncomeColor}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const assetsToRechartsData = (assets) => {
  const data = {};
  assets.forEach((asset) => {
    const key = asset.date;

    if (!data[key]) {
      data[key] = {};
    }

    data[key][asset.category.name] = Number(asset.sum);
  });

  return Object.entries(data).map(([key, values]) => ({
    date: key,
    ...values,
  }));
};

const investIncomeToRechartsData = (investIncome) => {
  const data = {};
  investIncome.forEach((item) => {
    const key = item.date;

    if (!data[key]) {
      data[key] = 0;
    }

    data[key] += Number(item.sum);
  });
  return Object.entries(data).map(([key, value]) => ({
    date: key,
    value,
  }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const monthName = new Intl.DateTimeFormat("ru", {
      month: "long",
    }).format(date);

    return (
      <div className="tooltip">
        <h3 className="tooltip__title capitalize">
          {monthName} {date.getFullYear()}
        </h3>
        <ul className="tooltip__items">
          {payload.map((item) => (
            <li className="tooltip__item" key={item.name}>
              {item.name !== "value" && (
                <span className="tooltip__label">
                  <span
                    className="tooltip__color"
                    style={{ background: item.fill }}
                  ></span>
                  {item.name}
                </span>
              )}
              <span className="tooltip__value">
                {item.value.toLocaleString("ru-RU", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
