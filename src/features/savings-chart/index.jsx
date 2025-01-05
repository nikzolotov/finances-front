import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

import { convertSavingsTimeline } from "../../utils/convert-data";
import { savingsColor } from "../../components/recharts/color-schemes";
import { SavingsTooltip } from "../chart-tooltip";

export const SavingsChart = ({ income, expenses }) => {
  const convertedData = convertSavingsTimeline(income, expenses);

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart
        data={convertedData}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="25%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          xAxisId={0}
          dataKey="date"
          padding={{ left: 16, right: 16 }}
          axisLine={false}
          tickLine={false}
          tickMargin={4}
          tickFormatter={(date) => {
            const dateObject = new Date(date);
            const month = dateObject.getMonth();
            const year = dateObject.getFullYear();
            return month === 0 ? `${year}` : "";
          }}
        />
        <XAxis
          xAxisId={1}
          dataKey="date"
          padding={{ left: 16, right: 16 }}
          hide
        />
        <XAxis
          xAxisId={2}
          dataKey="date"
          padding={{ left: 16, right: 16 }}
          hide
        />
        <YAxis
          padding={{ top: 16 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) =>
            value === 0 ? "0" : `${(value / 1000).toFixed(0)}K`
          }
        />
        <Tooltip content={<SavingsTooltip />} />
        <ReferenceLine y={0} />
        <Bar
          xAxisId={0}
          dataKey="income"
          name="Доходы"
          className="recharts-bg-bar"
          radius={4}
        />
        <Bar
          xAxisId={1}
          dataKey="expenses"
          name="Расходы"
          className="recharts-bg-bar"
          radius={4}
        />
        <Bar xAxisId={2} dataKey="savings" name="Сохранили" shape={SavingsBar}>
          <LabelList dataKey="savingsRate" content={SavingsRateLabel} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const SavingsRateLabel = (props) => {
  const { x, y, width, value } = props;
  const updatedY = value >= 0 ? y - 8 : y + 18;
  const className = value >= 0 ? "recharts-positive" : "recharts-negative";

  return (
    <text
      x={x + width / 2}
      y={updatedY}
      className={`recharts-label ${className}`}
      textAnchor="middle"
    >
      {value.toLocaleString("ru-RU", {
        maximumFractionDigits: 0,
      })}
    </text>
  );
};

const SavingsBar = (props) => {
  const fill = props.savings >= 0 ? savingsColor[0] : savingsColor[1];
  return <Rectangle {...props} fill={fill} radius={4} />;
};
