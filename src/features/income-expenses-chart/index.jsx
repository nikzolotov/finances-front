import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { schemeObservable10, schemeTableau10 } from "d3";

import { convertCategorizedTimeline } from "../../utils/convert-data";
import { TimelineTooltip } from "../chart-tooltip";

export const CategoryChart = ({ data, categories, colorScheme }) => {
  const convertedData = convertCategorizedTimeline(data);

  const colors =
    colorScheme === "income" ? schemeObservable10 : schemeTableau10;

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart
        data={convertedData}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="20%"
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
        <Tooltip offset={28} content={<TimelineTooltip />} />
        {categories.map((category, index) => (
          <Bar
            key={category.id}
            dataKey={category.name}
            stackId="1"
            fill={colors[category.id - 1]}
          >
            <LabelList
              position="top"
              offset={8}
              valueAccessor={(entry) =>
                index === categories.length - 1
                  ? (entry.value[1] / 1000).toFixed(0)
                  : null
              }
            />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
