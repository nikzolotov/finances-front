import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import { schemeTableau10 } from "d3";

export const MonthlyBudgetChart = ({ data }) => {
  const dataTable = data.map((item) => ({
    id: item.category.id,
    name: item.category.name,
    sum: item.sum,
  }));

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart
        data={dataTable}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          padding={{ left: 16, right: 16 }}
          tickLine={false}
          tickMargin={4}
        />
        <YAxis
          padding={{ top: 16 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) =>
            value === 0 ? "" : `${(value / 1000).toFixed(0)}K`
          }
        />
        <Bar dataKey="sum" shape={CustomBar}>
          <LabelList
            position="top"
            offset={8}
            formatter={(value) => value.toLocaleString("ru-RU")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Кастомный бар для того, чтобы прочитать цвет из данных
// Напрямую передать category.id в <Bar> не получилось
const CustomBar = (props) => {
  return <Rectangle {...props} fill={schemeTableau10[props.id - 1]} />;
};