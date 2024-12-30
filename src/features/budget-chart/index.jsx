import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  convertCategories,
  convertCategoriesAverages,
} from "../../utils/convert-data";
import { budgetColor } from "../../components/recharts/color-schemes";
import { CategoryTooltip } from "../chart-tooltip";

export const BudgetChart = ({ data, budgetData, annual = false }) => {
  const convertedData = annual
    ? convertCategoriesAverages(data, budgetData)
    : convertCategories(data, budgetData);

  return (
    <ResponsiveContainer width="100%" height={560}>
      <BarChart
        data={convertedData}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          xAxisId={0}
          dataKey="name"
          height={130}
          padding={{ left: 16, right: 16 }}
          tickLine={false}
          tickMargin={4}
          angle={45}
          textAnchor="start"
        />
        <XAxis
          xAxisId={1}
          dataKey="name"
          padding={{ left: 16, right: 16 }}
          hide
        />
        <YAxis
          padding={{ top: 16 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) =>
            value === 0 ? "" : `${(value / 1000).toFixed(0)}K`
          }
        />

        <Bar xAxisId={0} dataKey="sum" shape={CustomBar}>
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
        <Bar xAxisId={1} dataKey="budget" shape={CustomBudgetBar} />
        <Tooltip offset={16} content={<CategoryTooltip annual={annual} />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Кастомные бары, чтобы использовать данные для выбора цвета
const CustomBar = (props) => {
  const fill = props.sum > props.budget ? budgetColor[1] : budgetColor[0];
  return <Rectangle {...props} fill={fill} />;
};

const CustomBudgetBar = (props) => {
  const opacity = props.sum > props.budget ? 1 : 0.2;
  return <Rectangle {...props} fill={budgetColor[0]} fillOpacity={opacity} />;
};
