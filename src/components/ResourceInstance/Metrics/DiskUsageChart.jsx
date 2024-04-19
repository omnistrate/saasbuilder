import React from "react";
import { Text } from "../../Typography/Typography";
import { Box } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReChartContainer from "../../ReChartContainer/ReChartContainer";
import lineChartColorPalette from "../../../utils/constants/lineChartColorPalette";

function DiskUsageChart(props) {
  const { data, labels } = props;

  //   console.log("Disk usage", data);
  //   console.log("Disk usage paths", labels);
  return (
    <Box mt={8}>
      <Text sx={{ marginLeft: 3 }}>Disk Usage</Text>
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
            <XAxis
              dataKey="time"
              tickFormatter={(value) => ""}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              isAnimationActive={false}
              formatter={(value, name, props) => {
                return `${value}% `;
              }}
            />
            <Legend />
            {labels.map((labelName, index) => {
              return (
                <Line
                  key={labelName}
                  name={labelName}
                  type="monotone"
                  dataKey={labelName}
                  stroke={lineChartColorPalette[index]}
                  dot={false}
                  isAnimationActive={false}
                  label={labelName}
                  strokeWidth={2}
                  connectNulls
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </ReChartContainer>
    </Box>
  );
}

export default DiskUsageChart;
