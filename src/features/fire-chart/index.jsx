import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { TimelineTooltip } from "../../features/chart-tooltip";
import { FIREColor } from "../../components/recharts/color-schemes";

export const FIREChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="25%"
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
          yAxisId="left"
          padding={{ top: 16 }}
          dataKey="months"
          domain={[0, 300]}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => (value === 0 ? "" : value)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          padding={{ top: 16 }}
          dataKey="averageExpensesLTM"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) =>
            value === 0 ? "" : `${(value / 1000).toFixed(0)}K`
          }
        />
        <Tooltip
          offset={16}
          position={{ y: 4 }}
          content={<TimelineTooltip />}
        />
        <Bar
          yAxisId="right"
          dataKey="averageExpensesLTM"
          name="Средние расходы"
          className="recharts-bg-bar"
          radius={4}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="months"
          name="Накопили месяцев"
          stroke={FIREColor}
          fill={FIREColor}
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
