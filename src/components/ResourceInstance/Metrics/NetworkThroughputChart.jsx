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

function NetworkThroughputChart(props) {
  const { data, labels, chartName } = props;

  return (
    <Box mt={8}>
      <Text sx={{ marginLeft: 3 }}>{chartName}</Text>
      <ReChartContainer mt={3} debounce={100} height={320}>
        <ResponsiveContainer>
          <LineChart
            height={320}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 50,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={() => ""}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${value} MiB/s`}
              domain={([, datamax]) => [
                0,
                datamax > 0 ? Math.round(datamax + 1) : 1,
              ]}
              style={{ fontSize: 14 }}
            />
            <Tooltip
              isAnimationActive={false}
              formatter={(value) => `${value} MiB/s`}
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

export default NetworkThroughputChart;
