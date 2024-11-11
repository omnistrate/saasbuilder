import { Stack } from "@mui/material";
import Card from "components/Card/Card";
import { Text } from "components/Typography/Typography";

function MetricCard(props) {
  const { title = "", value = "", unit = "" } = props;

  return (
    <Card
      flex="1"
      sx={{
        padding: "18px",
        boxShadow: "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
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
        <Text
          size="medium"
          color="#6941C6"
          weight="semibold"
          sx={{ textAlign: "center" }}
        >
          {value}
        </Text>
        {value !== "" && unit && (
          <Text
            size="medium"
            color="#6941C6"
            weight="semibold"
            sx={{ ml: "4px" }}
          >
            {unit}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export default MetricCard;
