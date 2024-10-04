import { Stack } from "@mui/material";
import Card from "components/Card/Card";
import { DisplayText, Text } from "components/Typography/Typography";

function MetricCard(props) {
  const { title = "", value = "", unit = "" } = props;

  return (
    <Card
      flex="1"
      sx={{
        padding: "18px",
      }}
    >
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
        {value !== undefined && unit && (
          <Text size="medium" sx={{ ml: "4px" }}>
            {unit}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default MetricCard;
