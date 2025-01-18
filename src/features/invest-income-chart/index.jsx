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

import {
  convertTotalsTimeline,
  convertAnnualAverages,
} from "@/utils/convert-data";

import {
  TimelineTooltip,
  AnnualAveragesTooltip,
} from "@/features/chart-tooltip";

import { investIncomeColor } from "@/components/recharts/color-schemes";

export const InvestIncomeChart = ({ data, average }) => {
  const filteredData = data.filter((item) => item.category.isInvest);
  const convertedData = average
    ? convertAnnualAverages(filteredData)
    : convertTotalsTimeline(filteredData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={convertedData}
        margin={{ top: -2, right: 0, bottom: 0, left: 0 }}
        barCategoryGap="25%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          padding={{ left: 16, right: 16 }}
          tickLine={false}
          tickMargin={4}
          interval={0}
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
        <Tooltip
          offset={16}
          content={average ? <AnnualAveragesTooltip /> : <TimelineTooltip />}
        />
        <Bar
          dataKey="value"
          fill={investIncomeColor}
          radius={4}
          isAnimationActive={false}
        >
          <LabelList
            position="top"
            offset={8}
            valueAccessor={(entry) =>
              average ? (entry.value / 1000).toFixed(0) : ""
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
