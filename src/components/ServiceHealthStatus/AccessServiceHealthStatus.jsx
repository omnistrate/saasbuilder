import React, { useMemo } from "react";
import useServiceHealth from "src/hooks/query/useServiceHealth";
import {
  SERVICE_HEALTH_LABEL_MAP,
  SERVICE_HEALTH_LABEL_STYLES,
} from "src/utils/access/serviceHealth";
import Card from "../Card/Card";
import { Stack } from "@mui/material";
import { PulsatingDot } from "../PulsatingDot/PulsatingDot";
import { Text } from "../Typography/Typography";
import HealthIcon from "../Icons/ServiceHealth/HealthIcon";

function AccessServiceHealthStatus() {
  const serviceHealthQuery = useServiceHealth();

  const healthDescriptionData = useMemo(() => {
    const defaultLabel = SERVICE_HEALTH_LABEL_MAP.UNKNOWN;
    const label =
      SERVICE_HEALTH_LABEL_MAP[serviceHealthQuery?.data?.status] ||
      defaultLabel;

    return {
      description: label,
      styles: SERVICE_HEALTH_LABEL_STYLES[label] || {},
    };
  }, [serviceHealthQuery?.data?.status]);

  const label = healthDescriptionData?.description;
  const styles = healthDescriptionData?.styles;

  if (serviceHealthQuery?.isLoading) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: "88px",
        padding: "2px 24px !important",
        alignItems: "center",
        display: "flex",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"14px"}
        paddingY={"10px"}
      >
        <PulsatingDot color={styles?.color} />
        <Text size="medium" weight="medium">
          Service Health
        </Text>
        <Text size="medium" weight="bold" sx={{ ...styles }}>
          {label}
        </Text>
        <HealthIcon color={styles?.color} />
      </Stack>
    </Card>
  );
}

export default AccessServiceHealthStatus;
