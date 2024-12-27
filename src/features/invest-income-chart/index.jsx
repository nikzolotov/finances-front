import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { investIncomeColor } from "../../components/recharts/color-schemes";
import { ChartTooltip } from "../../features/chart-tooltip";

export const InvestIncomeChart = ({ data }) => {
  // Собираем инвестиционный доход в формат {date:"", value:""}
  const investIncome = data.filter((item) => item.category.isInvest);
  const investIncomeTable = investIncomeToRechartsData(investIncome);

  return (
    <ResponsiveContainer width="100%">
      <LineChart
        data={investIncomeTable}
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
        <Tooltip offset={16} position={{ y: 4 }} content={<ChartTooltip />} />
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