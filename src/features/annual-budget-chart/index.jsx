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

import { convertCategoriesAverages } from "../../utils/convert-data";

export const AnnualBudgetChart = ({ data }) => {
  const convertedData = convertCategoriesAverages(data);

  return (
    <ResponsiveContainer width="100%" height={560}>
      <BarChart
        data={convertedData}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          height={130}
          padding={{ left: 16, right: 16 }}
          tickLine={false}
          tickMargin={4}
          angle={45}
          textAnchor="start"
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
            formatter={(value) =>
              value.toLocaleString("ru-RU", {
                maximumFractionDigits: 0,
              })
            }
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
