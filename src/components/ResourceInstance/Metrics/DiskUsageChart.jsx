import React from "react";
import { Text } from "../../Typography/Typography";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReChartContainer from "../../ReChartContainer/ReChartContainer";
import lineChartColorPalette from "../../../utils/constants/lineChartColorPalette";
import { Box } from "@mui/material";

function DiskUsageChart(props) {
  const { data, labels } = props;

  return (
    <Box>
      <Box sx={{ padding: "10px 20px", borderBottom: "1px solid #EAECF0" }}>
        <Text size="medium" color="#344054" weight="semibold">
          Disk Usage
        </Text>
      </Box>
      <ReChartContainer mt={3} debounce={100}>
        <ResponsiveContainer>
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
            <XAxis dataKey="time" tickFormatter={() => ""} tickLine={false} />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              isAnimationActive={false}
              formatter={(value) => {
                return `${value}% `;
              }}
            />
            <Legend />
            {labels.map((labelName, index) => {
              return (
                <Area
                  key={labelName}
                  name={labelName}
                  type="monotone"
                  dataKey={labelName}
                  stroke={lineChartColorPalette[index]}
                  fill={lineChartColorPalette[index]}
                  dot={false}
                  isAnimationActive={false}
                  label={labelName}
                  strokeWidth={2}
                  connectNulls
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </ReChartContainer>
    </Box>
  );
}

export default DiskUsageChart;
