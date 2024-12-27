import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import { convertCategorizedData } from "../../utils/convert-data";
import { assetColors } from "../../components/recharts/color-schemes";
import { ChartTooltip } from "../../features/chart-tooltip";

export const AssetsChart = ({ data, categories }) => {
  const assetsTable = convertCategorizedData(data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={assetsTable}
        margin={0}
        className="recharts-hide-active-dots"
      >
        {categories.map((category) => (
          <Area
            key={category.id}
            type="monotone"
            dataKey={category.name}
            stackId="1"
            fill={assetColors[category.id - 1]}
            fillOpacity="1"
            stroke="none"
          />
        ))}
        <XAxis dataKey="date" hide={true} />
        <Tooltip offset={16} position={{ y: 4 }} content={<ChartTooltip />} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
