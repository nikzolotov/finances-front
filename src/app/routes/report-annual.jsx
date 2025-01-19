import { useLoaderData } from "react-router-dom";
import qs from "qs";

import { Totals, Total, Difference } from "@/features/totals";
import { Card } from "@/features/card";
import { MonthLinks } from "@/features/report-links";
import { MoneyFlowChart } from "@/features/money-flow-chart";
import { BudgetChart } from "@/features/budget-chart";
import { calculateTotal } from "@/utils/calc";
import "@/components/recharts/recharts.css";

export const AnnualReportLoader = async ({ params }) => {
  const query = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year}-01-01`,
        $lte: `${params.year}-12-28`,
      },
    },
    sort: "category.id:asc",
    pagination: {
      pageSize: 1000,
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

  const yearAgoQuery = qs.stringify({
    fields: ["date", "sum"],
    populate: "category",
    filters: {
      date: {
        $gte: `${params.year - 1}-01-01`,
        $lte: `${params.year - 1}-12-28`,
      },
    },
    pagination: {
      pageSize: 1000,
    },
  });

  const [
    expensesResponse,
    expensesBudgetResponse,
    incomeResponse,
    yearAgoExpensesResponse,
    yearAgoIncomeResponse,
  ] = await Promise.all([
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${query}`),
    fetch(
      `${import.meta.env.VITE_STRAPI_API_URL}expense-budgets?${budgetQuery}`
    ),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${query}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}expenses?${yearAgoQuery}`),
    fetch(`${import.meta.env.VITE_STRAPI_API_URL}incomes?${yearAgoQuery}`),
  ]);

  const [
    expensesData,
    expensesBudgetData,
    incomeData,
    yearAgoExpensesData,
    yearAgoIncomeData,
  ] = await Promise.all([
    expensesResponse.json(),
    expensesBudgetResponse.json(),
    incomeResponse.json(),
    yearAgoExpensesResponse.json(),
    yearAgoIncomeResponse.json(),
  ]);

  return {
    year: params.year,
    expenses: expensesData.data,
    expensesBudget: expensesBudgetData.data,
    income: incomeData.data,
    yearAgoExpenses: yearAgoExpensesData.data,
    yearAgoIncome: yearAgoIncomeData.data,
  };
};

export const AnnualReportRoute = () => {
  const {
    year,
    expenses,
    expensesBudget,
    income,
    yearAgoExpenses,
    yearAgoIncome,
  } = useLoaderData();

  // Считаем общие доходы и расходы
  const totalIncome = calculateTotal(income);
  const totalExpenses = calculateTotal(expenses);

  // Считаем общие доходы и расходы год назад для сравнения
  const yearAgoTotalIncome = calculateTotal(yearAgoIncome);
  const yearAgoTotalExpenses = calculateTotal(yearAgoExpenses);

  // Считаем сколько сохранили
  const savings = totalIncome - totalExpenses;

  // Считаем сколько сохранили год назад для сравнения
  const yearAgoSavings = yearAgoTotalIncome - yearAgoTotalExpenses;

  // Считаем процент сохранений
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

  // Считаем процент сохранений год назад
  const yearAgoSavingsRate =
    ((yearAgoTotalIncome - yearAgoTotalExpenses) / yearAgoTotalIncome) * 100;

  return (
    <>
      <h1 className="first">{year} год</h1>
      <Totals>
        <Total value={totalIncome} title="Доходы">
          <Difference
            value={totalIncome}
            comparisonValue={yearAgoTotalIncome}
            label="чем годом ранее"
            labelNoData="Нет данных за предыдущий год"
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
        </Total>
        <Total value={savings} title="Сохранили">
          <Difference
            value={savings}
            comparisonValue={yearAgoSavings}
            label="чем годом ранее"
            labelNoData="Нет данных за предыдущий год"
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
        </Total>
      </Totals>
      <Card title="Денежные потоки">
        <MoneyFlowChart income={income} expenses={expenses} />
      </Card>
      <MonthLinks title="Месячные отчеты" year={year} />
      <Card title="Бюджет">
        <BudgetChart data={expenses} budgetData={expensesBudget} annual />
      </Card>
    </>
  );
};
