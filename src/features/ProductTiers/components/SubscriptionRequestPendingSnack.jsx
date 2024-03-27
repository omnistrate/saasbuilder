import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import StopWatchTimer from "src/components/Icons/StopwatchTimer/StopWatchTimer";

function SubscriptionRequestPendingSnack() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "4px 14px",
        background: "#FFFAEB",
        borderRadius: "16px",
      }}
    >
      <StopWatchTimer />
      <Typography
        sx={{
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: 500,
          color: "#B54708",
        }}
      >
        Subscription request pending for approval
      </Typography>
    </Box>
  );
}

export default SubscriptionRequestPendingSnack;
