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
        padding: "6px 14px",
        background: "#FEF3F2",
        borderRadius: "16px",
      }}
    >
      <AlertTriangle style={{height: 16, width :20 }} />
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
