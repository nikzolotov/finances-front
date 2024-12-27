import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { assetColors } from "../../components/recharts/color-schemes";
import { ChartTooltip } from "../../features/chart-tooltip";

export const AssetsChart = ({ data, categories }) => {
  // Собираем активы в формат {date:"", Дом:"", Акции:"", ...}
  const assetsTable = assetsToRechartsData(data);

  return (
    <ResponsiveContainer width="100%" height="100%">
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

const assetsToRechartsData = (assets) => {
  const data = {};
  assets.forEach((asset) => {
    const key = asset.date;

    if (!data[key]) {
      data[key] = {};
    }

    data[key][asset.category.name] = Number(asset.sum);
  });

  return Object.entries(data).map(([key, values]) => ({
    date: key,
    ...values,
  }));
};
