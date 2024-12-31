import { Sankey, Layer, Rectangle, ResponsiveContainer } from "recharts";

import { convertAnnualSankey } from "../../utils/convert-data";

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
          top: 16,
          bottom: 48,
        }}
        link={{ stroke: "#AC54FA" }}
        iterations={50}
        sort={false}
      ></Sankey>
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
        fill="#AC54FA"
        fillOpacity="1"
      />
      <text
        textAnchor={"start"}
        x={x + width + 6}
        y={y + height / 2 + 4}
        fontSize="14"
        fill="#333"
      >
        {payload.name}
        <tspan> {`${payload.value}`}</tspan>
      </text>
    </Layer>
  );
};
