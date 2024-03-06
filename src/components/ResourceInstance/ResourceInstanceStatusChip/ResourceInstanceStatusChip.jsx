import React from "react";
import Chip from "../../Chip/Chip";
import { Stack, chipClasses } from "@mui/material";
import _ from "lodash";
import { statusStyles } from "../../StatusChip/StatusChip";

function ResourceInstanceStatusChip(props) {
  const { status } = props;
  const chipStyles = getChipStyles(status);
  let label = instanceStatuses[status];

  return (
    <Chip
      size="small"
      label={
        <Stack direction="row" alignItems="center">
          {label ? label : _.capitalize(status)}
        </Stack>
      }
      sx={{
        backgroundColor: chipStyles.backgroundColor,
        [`& .${chipClasses.label}`]: {
          color: chipStyles.color,
        },
      }}
    />
  );
}

export default ResourceInstanceStatusChip;

const instanceStatuses = {
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  PENDING_DEPENDENCY: "Pending Dependency",
  PENDING: "Pending",
  RUNNING: "Running",
  DEPLOYING: "Deploying",
  READY: "Ready",
  SUCCESS: "Success",
  COMPLETE: "Complete",
};

function getChipStyles(resourceInstanceStatus) {
  let chipStyles = statusStyles[resourceInstanceStatus];
  if (!chipStyles) chipStyles = statusStyles["PENDING"];

  return chipStyles;
}
