export type CloudProvider = "aws" | "gcp" | "azure";

export type FormMode = "view" | "edit" | "create" | "delete";

export type RESOURCETYPES = "OperatorCRD" | "Kustomize";

// Network Types
export type NetworkType = "PUBLIC" | "PRIVATE_VPC_PEERING" | "PRIVATE_LINK";

export type InstanceStatus =
  | "FAILED"
  | "CANCELLED"
  | "PENDING_DEPENDENCY"
  | "PENDING"
  | "RUNNING"
  | "DEPLOYING"
  | "READY"
  | "SUCCESS"
  | "COMPLETE"
  | "STOPPED"
  | "DELETING"
  | "UNKNOWN";
