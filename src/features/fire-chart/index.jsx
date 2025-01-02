import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { convertFIRETimeline } from "../../utils/convert-data";
import { TimelineTooltip } from "../../features/chart-tooltip";
import { FIREColor } from "../../components/recharts/color-schemes";

export const FIREChart = ({ assets, expenses }) => {
  const convertedData = convertFIRETimeline(assets, expenses);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={convertedData}
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
          dataKey="months"
          domain={[0, 300]}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => (value === 0 ? "" : value)}
        />
        <Tooltip
          offset={16}
          position={{ y: 4 }}
          content={<TimelineTooltip />}
        />
        <Line
          type="monotone"
          dataKey="months"
          name="Накопили месяцев"
          stroke={FIREColor}
          fill={FIREColor}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
