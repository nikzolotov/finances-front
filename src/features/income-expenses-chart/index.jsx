import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { convertCategorizedData } from "../../utils/convert-data";
import { assetColors } from "../../components/recharts/color-schemes";
import { ChartTooltip } from "../chart-tooltip";

import { schemeObservable10, schemeTableau10 } from "d3";

export const CategoryChart = ({ data, categories, colorScheme }) => {
  const incomeTable = convertCategorizedData(data);

  const colors =
    colorScheme === "income" ? schemeObservable10 : schemeTableau10;

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart
        data={incomeTable}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          padding={{ left: 16, right: 16 }}
          tickLine={false}
          tickMargin={4}
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
            value === 0 ? "" : `${(value / 1000).toFixed(0)}K`
          }
        />

        <Tooltip offset={28} position={{ y: 4 }} content={<ChartTooltip />} />
        {categories.map((category) => (
          <Bar
            key={category.id}
            dataKey={category.name}
            stackId="1"
            fill={colors[category.id - 1]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
