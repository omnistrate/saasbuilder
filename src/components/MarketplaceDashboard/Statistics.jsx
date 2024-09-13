import { useMemo } from "react";
import Card from "../Card/Card";
import { PulsatingDot } from "../PulsatingDot/PulsatingDot";
import { Text, DisplayText } from "../Typography/Typography";
import {  Grid, Stack } from "@mui/material";
import {
  SERVICE_HEALTH_LABEL_MAP,
  SERVICE_HEALTH_LABEL_STYLES,
} from "src/utils/access/serviceHealth";

function Statistics(props) {
  const { serviceHealthQuery, numResourceInstances, numResources } = props;
  const healthDescriptionData = useMemo(() => {
    const defaultLabel = SERVICE_HEALTH_LABEL_MAP.UNKNOWN;
    let res = {
      description: defaultLabel,
      styles: SERVICE_HEALTH_LABEL_STYLES[defaultLabel],
    };
    const label = SERVICE_HEALTH_LABEL_MAP[serviceHealthQuery?.data?.status];
    if (label) {
      res = {
        description: label,
        styles: SERVICE_HEALTH_LABEL_STYLES[label],
      };
    }
    return res;
  }, [serviceHealthQuery?.data?.status]);

  return (
    <>
      <Grid container spacing={3} mt={0}>
        <Grid item xs={4}>
          <StatInfoCard
            title="Service Health"
            description={healthDescriptionData?.description}
            descriptionStyles={healthDescriptionData?.styles}
          />
        </Grid>
        <Grid item xs={4}>
          <StatInfoCard title="Resources" description={numResources} />
        </Grid>

        <Grid item xs={4}>
          <StatInfoCard
            title="Resource Instances"
            description={numResourceInstances}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <StatInfoCard
            title="Projected Bill for this month"
            description="$210"
          />
        </Grid> */}
      </Grid>
    </>
  );
}

{
  /* <Card mt={3}>

<Grid container spacing={3} mt={0} mb={1.5}>
  <Grid item xs={4}>
    <StatInfoCard
      title="Resource Instances Running"
      description="120"
      descriptionStyles={{ color: "#027A48" }}
      cardStyles={{
        borderWidth: "1px 1px 4px 1px",
        borderColor: "#039855",
      }}
    />
  </Grid>

  <Grid item xs={4}>
    <StatInfoCard
      title="Resource Instances Stopped"
      description="120"
      descriptionStyles={{ color: "#3E4784" }}
      cardStyles={{
        borderWidth: "1px 1px 4px 1px",
        borderColor: "#3E4784",
      }}
    />
  </Grid>
  <Grid item xs={4}>
    <StatInfoCard
      title="Resource Instances Failed"
      description="120"
      descriptionStyles={{ color: "#D92D20" }}
      cardStyles={{
        borderWidth: "1px 1px 4px 1px",
        borderColor: "#D92D20",
      }}
    />
  </Grid>
</Grid>
</Card> */
}

export default Statistics;

const StatInfoCard = (props) => {
  const {
    title = "",
    description = "",
    titleStyles = {},
    descriptionStyles = {},
    cardStyles = {},
  } = props;
  return (
    <Card
      sx={{
        borderRadius: "12px",
        ...cardStyles,
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"10px"}
      >
        {title === "Service Health" && description === "Normal" && (
          <PulsatingDot />
        )}
        <Text size="medium" weight="medium" sx={{ ...titleStyles }}>
          {title}
        </Text>
      </Stack>
      <DisplayText size="medium" sx={{ mt: 3, ...descriptionStyles }}>
        {description}
      </DisplayText>
    </Card>
  );
};
