import { Text } from "../../Typography/Typography";
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReChartContainer from "../../ReChartContainer/ReChartContainer";
import { Box } from "@mui/material";

function CpuUsageChart(props) {
  const { data } = props;

  return (
    <Box>
      <Box sx={{ padding: "10px 20px", borderBottom: "1px solid #EAECF0" }}>
        <Text size="medium" color="#344054" weight="semibold">
          CPU Usage
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
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value, name, props) => {
                return `${value}% | Time :${props.payload.x}`;
              }}
              isAnimationActive={false}
            />

            <Area
              name="CPU Usage"
              type="monotone"
              dataKey="y"
              stroke="#82ca9d"
              fill="#82ca9d"
              dot={false}
              isAnimationActive={false}
              label="CPU Usage"
              strokeWidth={2}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </ReChartContainer>
    </Box>
  );
}

export default CpuUsageChart;
