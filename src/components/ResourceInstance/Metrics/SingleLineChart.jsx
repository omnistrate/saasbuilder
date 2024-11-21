import { Text } from "src/components/Typography/Typography";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReChartContainer from "src/components/ReChartContainer/ReChartContainer";
import { Box } from "@mui/material";

function SingleLineChart(props) {
  const { data, chartName } = props;
  return (
    <Box>
      <Box sx={{ padding: "10px 20px", borderBottom: "1px solid #EAECF0" }}>
        <Text size="medium" color="#344054" weight="semibold">
          {chartName}
        </Text>
      </Box>
      <ReChartContainer mt={3} debounce={100}>
        <ResponsiveContainer height={300} width="100%">
          <AreaChart
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 50,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" tickLine={false} tickFormatter={() => ""} />
            <YAxis
              domain={([, datamax]) => [
                0,
                datamax > 0 ? Math.round(datamax + 1) : 1,
              ]}
            />
            <Tooltip
              formatter={(value, name, props) => {
                return `${value} | Time :${props.payload.x}`;
              }}
              isAnimationActive={false}
            />

            <Area
              name={chartName}
              type="monotone"
              dataKey="y"
              stroke="#82ca9d"
              fill="#82ca9d"
              dot={false}
              isAnimationActive={false}
              label={chartName}
              strokeWidth={2}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </ReChartContainer>
    </Box>
  );
}

export default SingleLineChart;
