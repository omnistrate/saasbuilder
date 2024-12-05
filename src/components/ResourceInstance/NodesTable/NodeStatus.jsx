import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import NodeStatusTooltip from "./NodeStatusTooltip";
import { getChipStyles } from "src/components/StatusChip/StatusChip";

export const NodeStatus = (props) => {
  const { detailedHealth, isStopped } = props;
  const [currentDot, setCurrentDot] = useState(5); // 5 means all dots lit
  const ConnectivityStatus = detailedHealth?.ConnectivityStatus;
  const DiskHealth = detailedHealth?.DiskHealth;
  const NodeHealth = detailedHealth?.NodeHealth;
  const ProcessHealth = detailedHealth?.ProcessHealth;
  const ProcessLiveness = detailedHealth?.ProcessLiveness;
  const detailedHealthStatus = [
    ConnectivityStatus,
    DiskHealth,
    NodeHealth,
    ProcessHealth,
    ProcessLiveness,
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentDot((prev) => (prev <= 0 ? 5 : prev - 1));
      }, 200);
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NodeStatusTooltip detailedHealth={detailedHealth}>
      <Box
        bgcolor="#ECFDF3"
        display="flex"
        alignItems="center"
        gap="6px"
        borderRadius="16px"
        p="4px 8px"
      >
        {detailedHealthStatus.map((status, index) => {
          const chipStyles = getChipStyles(isStopped ? "UNKNOWN" : status);
          return (
            <Box
              key={index}
              bgcolor={chipStyles.color || "#363F72"}
              width="7px"
              height="7px"
              borderRadius="50%"
              sx={{
                opacity: index >= currentDot ? 0.25 : 1,
                transition: `opacity 0.1s linear`,
              }}
            />
          );
        })}
      </Box>
    </NodeStatusTooltip>
  );
};
