export const SERVICE_HEALTH_STATUS = {
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  PENDING_DEPENDENCY: "PENDING_DEPENDENCY",
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  DEPLOYING: "DEPLOYING",
  READY: "READY",
  SUCCESS: "SUCCESS",
  COMPLETE: "COMPLETE",
  UNKNOWN: "UNKNOWN",
  UNHEALTHY: "UNHEALTHY",
};
export const SERVICE_HEALTH_LABEL_MAP = {
  FAILED: "Unhealthy",
  CANCELLED: "Unhealthy",
  PENDING_DEPENDENCY: "Unhealthy",
  PENDING: "Unhealthy",
  DEPLOYING: "Unhealthy",
  UNKNOWN: "Unknown",
  UNHEALTHY: "Unhealthy",
  RUNNING: "Normal",
  READY: "Normal",
  SUCCESS: "Normal",
  COMPLETE: "Normal",
};

export const SERVICE_HEALTH_LABEL_STYLES = {
  Unhealthy: {
    color: "#B42318",
  },
  Normal: {
    color: "#027A48",
  },
  Unknown: {
    color: "#06AED4",
  },
};
