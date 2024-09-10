import React from "react";
import { Stack, chipClasses } from "@mui/material";
import Chip from "../Chip/Chip";
import { PulsatingDot } from "../PulsatingDot/PulsatingDot";
import { getChipStyles } from "../StatusChip/StatusChip";

function StatusChipPulsateDot(props) {
  const {
    status,
    sx = {},
    pulsateDot,
    color,
    bgColor,
    ...restProps
  } = props;

  const chipStyles = getChipStyles(status);

  const fontColor = color ? color : chipStyles.color;
  const backgroundColor = bgColor ? bgColor : chipStyles.backgroundColor;

  return (
    <Chip
      label={
        <Stack direction="row" alignItems="center" gap={"1px"}>
          {pulsateDot && <PulsatingDot size={8} color={fontColor} />}
        </Stack>
      }
      sx={{
        backgroundColor: backgroundColor,
        [`& .${chipClasses.label}`]: {
          color: fontColor,
        },
        padding: "1px 4px",
        ...sx,
      }}
      {...restProps}
    />
  );
}

export default StatusChipPulsateDot;
