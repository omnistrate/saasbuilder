import { QueryOptions, useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { getInstanceRestoreAccess } from "src/api/resourceInstance";
import { accessQueryParams } from "../Backup";

type QueryParams = {
  serviceId?: string;
  environmentId?: string;
  instanceId?: string;
  accessQueryParams?: accessQueryParams;
  isEnable?: boolean;
};

// Shared properties between fleet and access responses
type SnapshotBase = {
  completeTime: string;
  createdTime: string;
  encrypted: boolean;
  progress: number;
  snapshotId: string;
  status: string;
};

// Fleet-specific properties
type FleetSnapshot = SnapshotBase & {
  environmentId?: string;
  productTierId?: string;
  productTierVersion?: string;
  serviceId?: string;
  sourceInstanceId?: string;
};

// Access-specific properties
type AccessSnapshot = SnapshotBase;

// Union type to represent either fleet or access snapshot
export type RestoreResponse = FleetSnapshot | AccessSnapshot;

function useBackup(
  queryParams: QueryParams = {},
  queryOptions: QueryOptions = {}
) {
  const { instanceId, accessQueryParams, isEnable } = queryParams;

  const enabled = Boolean(instanceId && isEnable);

  const query: UseQueryResult<RestoreResponse[]> = useQuery(
    ["instanceRestore", instanceId],
    () => {
      const {
        serviceProviderId,
        serviceKey,
        serviceAPIVersion,
        serviceEnvironmentKey,
        serviceModelKey,
        productTierKey,
        resourceKey,
        subscriptionId,
      } = accessQueryParams;
      return getInstanceRestoreAccess(
        serviceProviderId,
        serviceKey,
        serviceAPIVersion,
        serviceEnvironmentKey,
        serviceModelKey,
        productTierKey,
        resourceKey,
        instanceId,
        subscriptionId
      );
    },
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: true,
      refetchInterval: 30000,
      onError: () => {},
      select: (response: AxiosResponse) => {
        return response?.data?.snapshots || [];
      },
      ...queryOptions,
    }
  );

  return query;
}

export default useBackup;
