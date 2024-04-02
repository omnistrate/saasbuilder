import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import AlertTriangle from "src/components/Icons/AlertTriangle/AlertTriangle";

function SubscriptionSuspendedSnack() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "4px 14px",
        background: "#FEF3F2",
        borderRadius: "16px",
      }}
    >
      <AlertTriangle />
      <Typography
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#B54708",
        }}
      >
        Subscription suspended
      </Typography>
    </Box>
  );
}

export default SubscriptionSuspendedSnack;
