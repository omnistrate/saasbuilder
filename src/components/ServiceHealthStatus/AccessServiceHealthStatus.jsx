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
        borderRadius: "24px",
        padding: "2px 10px !important",
        display: "flex",
        gap: "18px",
        border: "1px solid rgba(208, 213, 221, 1)",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        height: "32px",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"8px"}
        paddingY={"6px"}
      >
        <PulsatingDot color={styles?.color} />
        <Text size="small" weight="medium" color="rgba(52, 64, 84, 1)">
          Service Health
        </Text>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"8px"}
        paddingY={"6px"}
      >
        <Text size="small" weight="bold" sx={{ ...styles }}>
          {label}
        </Text>
        <HealthIcon color={styles?.color} />
      </Stack>
    </Card>
  );
}

export default AccessServiceHealthStatus;
