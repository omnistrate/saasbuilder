import React from "react";
import { Text } from "../../Typography/Typography";
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
import { Box } from "@mui/material";

function LoadAverageChart(props) {
  const { data } = props;

  return (
    <Box>
      <Box sx={{ padding: "10px 20px", borderBottom: "1px solid #EAECF0" }}>
        <Text size="medium" color="#344054" weight="semibold">
          Load Average
        </Text>
      </Box>
      <ReChartContainer mt={3} debounce={100}>
        <ResponsiveContainer>
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
            <YAxis domain={[0, 1]} tickFormatter={(value) => `${value}`} />
            <Tooltip
              formatter={(value, name, props) => {
                return `${value} | Time :${props.payload.x}`;
              }}
              isAnimationActive={false}
            />

            <Line
              name="Load Average"
              type="monotone"
              dataKey="y"
              stroke="#82ca9d"
              dot={false}
              isAnimationActive={false}
              label="Load Average"
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ReChartContainer>
    </Box>
  );
}

export default LoadAverageChart;
