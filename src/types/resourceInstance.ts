import {
  CloudProvider,
  InstanceStatus,
  NetworkType,
  RESOURCETYPES,
} from "./common/enums";

export const RESOURCE_TYPES = {
  OperatorCRD: "OperatorCRD",
  Kustomize: "Kustomize",
};

type ResourceNetworkTopology = {
  allowedIPRanges?: string[];
  clusterEndpoint?: string;
  clusterPorts?: number[];
  hasCompute: boolean;
  main?: boolean;
  networkingType?: string;
  nodes?: any[];
  privateNetworkCIDR?: string;
  privateNetworkID?: string;
  proxyEndpoint?: {
    openPorts: string[];
    proxyEndpoint: string;
  };
  publiclyAccessible?: boolean;
  resourceKey?: string;
  resourceName?: string;
};

//Access Resource Instance
export type AccessResourceInstance = {
  backupStatus?: {
    earliestRestoreTime: string;
  };
  active: boolean;
  awsAccountID?: string;
  cloud_provider?: CloudProvider;
  created_at: string;
  createdByUserId: string;
  createdByUserName: string;
  detailedNetworkTopology?: Record<string, ResourceNetworkTopology>;
  externalPayerId?: string;
  gcpProjectID?: string;
  id: string;
  last_modified_at: string;
  network_type?: NetworkType;
  productTierFeatures: any; // TODO: Change this
  region?: string;
  result_params: Record<string, any>;
  status: InstanceStatus;
  highAvailability: boolean;
  resourceType: RESOURCETYPES;
};
