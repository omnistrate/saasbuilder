import { useMemo } from "react";
import Card from "../Card/Card";
import { PulsatingDot } from "../PulsatingDot/PulsatingDot";
import { Text, DisplayText } from "../Typography/Typography";
import { Grid, Stack } from "@mui/material";
import {
  SERVICE_HEALTH_LABEL_MAP,
  SERVICE_HEALTH_LABEL_STYLES,
} from "utils/access/serviceHealth";
import ServiceHealthIcon from "../Icons/Dashboard/ServiceHealth";
import ResourcesIcon from "../Icons/Dashboard/Resources";
import ResourceInstancesIcon from "../Icons/Dashboard/ResourceInstances";

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
      <Grid container spacing={4} mt={0}>
        <Grid item xs={4}>
          <StatInfoCard
            title="Service Health"
            description={healthDescriptionData?.description}
            descriptionStyles={healthDescriptionData?.styles}
            IconComponent={ServiceHealthIcon}
          />
        </Grid>
        <Grid item xs={4}>
          <StatInfoCard
            title="Resources"
            description={numResources}
            IconComponent={ResourcesIcon}
          />
        </Grid>

        <Grid item xs={4}>
          <StatInfoCard
            title="Resource Instances"
            description={numResourceInstances}
            IconComponent={ResourceInstancesIcon}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Statistics;

const StatInfoCard = (props) => {
  const {
    title = "",
    description = "",
    titleStyles = {},
    descriptionStyles = {},
    cardStyles = {},
    IconComponent,
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginTop="16px"
        gap="8px"
      >
        <DisplayText size="medium" sx={{ ...descriptionStyles }}>
          {description}
        </DisplayText>
        {IconComponent ? <IconComponent /> : ""}
      </Stack>
    </Card>
  );
};
