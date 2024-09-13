import React from "react";
import { Text } from "../../Typography/Typography";
import { Box } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReChartContainer from "../../ReChartContainer/ReChartContainer";

function MemUsagePercentChart(props) {
  const { data } = props;

  return (
    <Box mt={8}>
      <Text sx={{ marginLeft: 3 }}>Memory Usage </Text>
      <ReChartContainer mt={3}>
        <ResponsiveContainer debounce={100}>
          <LineChart
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
            <XAxis dataKey="name" tickLine={false} />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value, name, props) => {
                return `${value}% | Time :${props.payload.x}`;
              }}
              isAnimationActive={false}
            />

            <Line
              name="Memory Usage"
              type="monotone"
              dataKey="y"
              stroke="#82ca9d"
              dot={false}
              isAnimationActive={false}
              label="Memory Usage"
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ReChartContainer>
    </Box>
  );
}

export default MemUsagePercentChart;
