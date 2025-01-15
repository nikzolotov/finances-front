import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Total, Difference } from "@/features/total";
import { BlogText } from "@/features/blog-text";
import { BudgetChart } from "@/features/budget-chart";
import { calculateTotal, calculateAverage } from "@/utils/calc";
import "@/components/recharts/recharts.css";

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
    sort: "category.id:asc",
    pagination: {
      pageSize: 100,
    },
  });

  const budgetQuery = qs.stringify({
    fields: ["year", "sum"],
    populate: "category",
    filters: {
      year: {
        $eq: params.year,
      },
    },
    sort: "category.id:asc",
    pagination: {
      pageSize: 100,
    },
  });

  const annualQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year}-01-01`,
        $lte: `${params.year}-12-28`,
      },
    },
    sort: "date:asc",
    pagination: {
      pageSize: 1000,
    },
  });

  const yearAgoQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year - 1}-${params.month}-01`,
        $lte: `${params.year - 1}-${params.month}-28`,
      },
    },
    pagination: {
      pageSize: 100,
    },
  });

  const [
    expensesResponse,
    expensesBudgetResponse,
    incomeResponse,
    annualExpensesResponse,
    annualIncomeResponse,
    yearAgoExpensesResponse,
    yearAgoIncomeResponse,
  ] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(
      `${import.meta.env.VITE_STRAPI_API_URL}expense-budgets?${budgetQuery}`
    ),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${annualQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${annualQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${yearAgoQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${yearAgoQuery}`),
  ]);

  const [
    expensesData,
    expensesBudgetData,
    incomeData,
    annualExpensesData,
    annualIncomeData,
    yearAgoExpensesData,
    yearAgoIncomeData,
  ] = await Promise.all([
    expensesResponse.json(),
    expensesBudgetResponse.json(),
    incomeResponse.json(),
    annualExpensesResponse.json(),
    annualIncomeResponse.json(),
    yearAgoExpensesResponse.json(),
    yearAgoIncomeResponse.json(),
  ]);

  return {
    year: params.year,
    month: params.month,
    expenses: expensesData.data,
    expensesBudget: expensesBudgetData.data,
    income: incomeData.data,
    annualExpenses: annualExpensesData.data,
    annualIncome: annualIncomeData.data,
    yearAgoExpenses: yearAgoExpensesData.data,
    yearAgoIncome: yearAgoIncomeData.data,
  };
};

export const MonthlyReportRoute = () => {
  const {
    year,
    month,
    expenses,
    expensesBudget,
    income,
    annualExpenses,
    annualIncome,
    yearAgoExpenses,
    yearAgoIncome,
  } = useLoaderData();

  const date = new Date(year, month - 1, 1);

  const monthName = new Intl.DateTimeFormat("ru", {
    month: "long",
  }).format(date);

  // Записи отсортированы по дате. Берём последнюю дату, чтобы узнать общее количество месяцев,
  // за которые есть записи. Это понадобится для расчёта средних значений
  const lastDate =
    annualIncome.length > 0
      ? new Date(annualIncome[annualIncome.length - 1].date)
      : date;

  // Считаем общие доходы и расходы за месяц
  const totalIncome = calculateTotal(income);
  const totalExpenses = calculateTotal(expenses);

  // Считаем общие доходы и расходы за этот месяц год назад
  const yearAgoTotalIncome = calculateTotal(yearAgoIncome);
  const yearAgoTotalExpenses = calculateTotal(yearAgoExpenses);

  // Считаем средние доходы и расходы в году
  const averageIncome = calculateAverage(annualIncome, lastDate.getMonth() + 1);
  const averageExpenses = calculateAverage(
    annualExpenses,
    lastDate.getMonth() + 1
  );

  // Считаем сколько сохранили
  const savings = totalIncome - totalExpenses;

  // Считаем сколько сохранили год назад
  const yearAgoSavings = yearAgoTotalIncome - yearAgoTotalExpenses;

  // Считаем сколько в среднем сохраняли в году
  const averageSavings = averageIncome - averageExpenses;

  // Считаем процент сохранений
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

  // Считаем процент сохранений год назад
  const yearAgoSavingsRate =
    ((yearAgoTotalIncome - yearAgoTotalExpenses) / yearAgoTotalIncome) * 100;

  // Считаем средний процент сохранений в году
  const averageSavingsRate =
    ((averageIncome - averageExpenses) / averageIncome) * 100;

  // Сортируем расходы и доходы для текста блога
  const sortedExpenses = [...expenses].sort((a, b) => b.sum - a.sum);
  const sortedIncome = [...income].sort((a, b) => b.sum - a.sum);

  return (
    <>
      <h1 className="first capitalize">
        {monthName} {year}
      </h1>
      <div className="cards">
        <Total value={totalIncome} title="Доходы">
          <Difference
            value={totalIncome}
            comparisonValue={yearAgoTotalIncome}
            label="чем годом ранее"
            labelNoData="Нет данных за предыдущий год"
          />
          <Difference
            value={totalIncome}
            comparisonValue={averageIncome}
            label={`к среднему за ${year}`}
            labelNoData="Недостаточно средних данных"
          />
        </Total>
        <Total value={totalExpenses} title="Расходы">
          <Difference
            value={totalExpenses}
            comparisonValue={yearAgoTotalExpenses}
            label="чем годом ранее"
            labelNoData="Нет данных за предыдущий год"
            invert
          />
          <Difference
            value={totalExpenses}
            comparisonValue={averageExpenses}
            label={`к среднему за ${year}`}
            labelNoData="Недостаточно средних данных"
            invert
          />
        </Total>
        <Total value={savings} title="Сохранили">
          <Difference
            value={savings}
            comparisonValue={yearAgoSavings}
            label="чем годом ранее"
            labelNoData="Нет данных за предыдущий год"
          />
          <Difference
            value={savings}
            comparisonValue={averageSavings}
            label={`к среднему за ${year}`}
            labelNoData="Недостаточно средних данных"
          />
        </Total>
        <Total value={savingsRate} title="Процент сохранений" percent>
          <Difference
            value={savingsRate}
            comparisonValue={yearAgoSavingsRate}
            label="чем годом ранее"
            labelNoData="Нет данных за предыдущий год"
            percent
          />
          <Difference
            value={savingsRate}
            comparisonValue={averageSavingsRate}
            label={`к среднему за ${year}`}
            labelNoData="Недостаточно средних данных"
            percent
          />
        </Total>
      </div>
      <div className="card">
        <h2 className="first">Бюджет</h2>
        <BudgetChart data={expenses} budgetData={expensesBudget} />
      </div>
      <BlogText
        expenses={sortedExpenses}
        income={sortedIncome}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        savings={savings}
        savingsRate={savingsRate}
      />
    </>
  );
};
