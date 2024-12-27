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
import { ChartTooltip } from "../../features/chart-tooltip";

export const IncomeChart = ({ data, categories }) => {
  const incomeTable = convertCategorizedData(data);

  return (
    <ResponsiveContainer width="100%">
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
            fill={assetColors[category.id - 1]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
