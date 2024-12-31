import { Sankey, Layer, Rectangle, ResponsiveContainer } from "recharts";

import { convertAnnualSankey } from "../../utils/convert-data";
import { sankeyColor } from "../../components/recharts/color-schemes";

export const MoneyFlowChart = ({ income, expenses }) => {
  const convertedData = convertAnnualSankey(income, expenses);

  return (
    <ResponsiveContainer width="100%" height={800}>
      <Sankey
        data={convertedData}
        dataKey="sum"
        node={<SankeyNode />}
        nodePadding={24}
        margin={{
          left: 0,
          right: 220,
          top: 8,
          bottom: 24,
        }}
        link={{ stroke: sankeyColor[0] }}
        iterations={50}
        sort={false}
        // link={{ stroke: "url(#linkGradient)" }}
      >
        {/* <defs>
          <linearGradient id={"linkGradient"}>
            <stop offset="0%" stopColor="rgba(0, 136, 254, 1)" />
            <stop offset="100%" stopColor="rgba(0, 197, 159, 1)" />
          </linearGradient>
        </defs> */}
      </Sankey>
    </ResponsiveContainer>
  );
};

const SankeyNode = ({ x, y, width, height, index, payload }) => {
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={sankeyColor[0]}
        fillOpacity="1"
      />
      <text
        className="recharts-sankey-label"
        textAnchor={"start"}
        x={x + width + 6}
        y={y + height / 2 + 4}
      >
        {payload.name}
        <tspan className="recharts-sankey-label__value" dx="0.5em">
          {`${payload.value.toLocaleString("ru-RU", {
            maximumFractionDigits: 0,
          })}`}
        </tspan>
      </text>
    </Layer>
  );
};
