import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import { schemeTableau10 } from "d3";

export const MonthlyBudgetChart = ({ data, categories }) => {
  // const dataTable = data;
  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart
        data={data}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category[name]"
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
        <Bar dataKey="sum" fill={schemeTableau10[0]}>
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
