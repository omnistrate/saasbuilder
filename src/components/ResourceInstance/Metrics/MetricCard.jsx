import { Box, Stack } from "@mui/material";
import React from "react";
import Card from "../../Card/Card";
import { DisplayText, Text } from "../../Typography/Typography";

function MetricCard(props) {
  const { title = "", value = "", unit = "" } = props;

  return (
    <Card height="100%">
      <Text
        size="small"
        color="#475467"
        weight="medium"
        sx={{ textAlign: "center" }}
      >
        {title}
      </Text>
      <Stack
        direction="row"
        justifyContent="center"
        mt="8px"
        alignItems="baseline"
      >
        <DisplayText size="small">{value}</DisplayText>
        {value ? (
          <Text size="medium" sx={{ ml: "4px" }}>
            {unit}
          </Text>
        ) : (
          ""
        )}
      </Stack>
    </Card>
  );
}

export default MetricCard;
