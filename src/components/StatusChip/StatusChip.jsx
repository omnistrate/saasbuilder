import React from "react";
import { Box, Stack, chipClasses } from "@mui/material";
import _ from "lodash";
import Chip from "../Chip/Chip";
import Dot from "../Dot/Dot";
import TickIcon from "../Icons/Tick/TickIcon";
import { PulsatingDot } from "../PulsatingDot/PulsatingDot";

function StatusChip(props) {
  const {
    status,
    sx = {},
    dot,
    pulsateDot,
    tick,
    color,
    bgColor,
    ...restProps
  } = props;
  const chipStyles = getChipStyles(status);
  const label = statuses[status];

  const fontColor = color ? color : chipStyles.color;
  const backgroundColor = bgColor ? bgColor : chipStyles.backgroundColor;

  return (
    <Chip
      label={
        <Stack direction="row" alignItems="center" gap={"5px"}>
          {pulsateDot && <PulsatingDot color={fontColor} />}
          {dot && <Dot color={fontColor} />}
          {tick && <TickIcon />}
          <Box component="span">{label ? label : _.capitalize(status)}</Box>
        </Stack>
      }
      sx={{
        backgroundColor: backgroundColor,
        [`& .${chipClasses.label}`]: {
          color: fontColor,
        },
        ...sx,
      }}
      {...restProps}
    />
  );
}

export default StatusChip;

export const statuses = {
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  PENDING_DEPENDENCY: "Pending Dependency",
  PENDING: "Pending",
  RUNNING: "Running",
  DEPLOYING: "Deploying",
  READY: "Ready",
  SUCCESS: "Success",
  COMPLETE: "Complete",
  STOPPED: "Stopped",
  STOPPING: "Stopping",
  HEALTHY: "Healthy",
  UNHEALTHY: "Unhealthy",
  UNKNOWN: "Unknown",
  IN_PROGRESS: "In Progress",
  DELETED: "Deleted",
};

export const statusStyles = {
  ACTIVE: {
    backgroundColor: "#F8F9FC",
    color: "#669F2A",
  },
  Active: {
    backgroundColor: "#F8F9FC",
    color: "#669F2A",
  },
  CANCELLED: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  COMPLETE: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  DELETING: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  DEPLOYING: {
    backgroundColor: "#FFF4ED",
    color: "#EAAA08",
  },

  DEPRECATED: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  Draft: {
    backgroundColor: "#FCFCFC",
    color: "#6F6F6F",
  },
  FAILED: {
    backgroundColor: "#FEF3F2",
    color: "#FA113D",
  },
  DELETED: {
    backgroundColor: "#FEF3F2",
    color: "#FA113D",
  },
  HEALTHY: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  IN_PROGRESS: {
    backgroundColor: "#F8F9FC",
    color: "#669F2A",
  },
  Open: {
    backgroundColor: "#EFF8FF",
    color: "#1942C6",
  },
  PAID: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  Paid: {
    backgroundColor: "#ECFDF3",
    color: "#4F9F52",
  },
  PENDING: {
    backgroundColor: "#EFF8FF",
    color: "#06AED4",
  },
  PENDING_DEPENDENCY: {
    backgroundColor: "#EEF4FF",
    color: "#3538CD",
  },
  PREFERRED: {
    color: "#175CD3",
    backgroundColor: "#EFF8FF",
  },
  Preferred: {
    color: "#175CD3",
    backgroundColor: "#EFF8FF",
  },
  READY: {
    backgroundColor: "#EDFCF2",
    color: "#669F2A",
  },
  RELEASED: {
    backgroundColor: "#ECFDF3",
    color: "#4F9F52",
  },
  RUNNING: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  STOPPED: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  STOPPING: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  SUCCESS: {
    backgroundColor: "#ECFDF3",
    color: "#66C61C",
  },
  UNHEALTHY: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  UNKNOWN: {
    backgroundColor: "#F2F4F7",
    color: "#808080",
  },
  Voided: {
    backgroundColor: "#FEF3F2",
    color: "#C83532",
  },
};

export function getChipStyles(resourceInstanceStatus) {
  let chipStyles = statusStyles[resourceInstanceStatus];
  if (!chipStyles) chipStyles = statusStyles["PENDING"];

  return chipStyles;
}
