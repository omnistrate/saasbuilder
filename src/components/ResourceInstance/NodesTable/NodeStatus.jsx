import NodeStatusTooltip from "./NodeStatusTooltip";
import StatusChipPulsateDot from "src/components/StatusChipPulsateDot/StatusChipPulsateDot";
import { useEffect, useState } from "react";

export const NodeStatus = (props) => {
  const { detailedHealth, isStopped } = props;
  const [activeDot, setActiveDot] = useState(0);
  const ConnectivityStatus = detailedHealth?.ConnectivityStatus;
  const DiskHealth = detailedHealth?.DiskHealth;
  const NodeHealth = detailedHealth?.NodeHealth;
  const ProcessHealth = detailedHealth?.ProcessHealth;
  const ProcessLiveness = detailedHealth?.ProcessLiveness;
  useEffect(() => {
    // Function to update active dot every second
    const interval = setInterval(() => {
      setActiveDot((prevDot) => (prevDot + 1) % 5);
    }, 500);

    return () => clearInterval(interval);
  }, []);
  const detailedHealthStatus = [
    ConnectivityStatus,
    DiskHealth,
    NodeHealth,
    ProcessHealth,
    ProcessLiveness,
  ];
  return (
    <NodeStatusTooltip detailedHealth={detailedHealth}>
      <>
        {detailedHealthStatus.map((status, index) => (
          <StatusChipPulsateDot
            key={index}
            status={isStopped ? "UNKNOWN" : status}
            color={index < activeDot && "gray"}
            pulsateDot={true}
          />
        ))}
      </>
    </NodeStatusTooltip>
  );
};
