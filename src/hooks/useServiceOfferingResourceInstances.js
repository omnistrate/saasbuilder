import { useQuery } from "@tanstack/react-query";
import {
  getResourceInstanceIds,
  getResourceInstanceDetails,
} from "../api/resourceInstance";
import { useState } from "react";

function useServiceOfferingResourceInstances(
  serviceId,
  serviceProviderId,
  serviceURLKey,
  serviceAPIVersion,
  serviceEnvironmentURLKey,
  serviceModelURLKey,
  productTierURLKey,
  resourceParameters = [],
  subscriptionId
) {
  const isQueryEnabled = Boolean(
    serviceId &&
      serviceProviderId &&
      serviceURLKey &&
      serviceAPIVersion &&
      serviceEnvironmentURLKey &&
      serviceModelURLKey &&
      productTierURLKey &&
      Array.isArray(resourceParameters) &&
      resourceParameters.length > 0 &&
      subscriptionId
  );

  const [resourceInstances, setResourceInstances] = useState([]);

  const query = useQuery(
    ["resourceInstances", serviceId, serviceEnvironmentURLKey],
    async () => {
      const resourceInstanceIds = [];
      //fetch resource instance ids for each resource
      await Promise.all(
        resourceParameters.map((resourceParamter) => {
          return getResourceInstanceIds(
            serviceProviderId,
            serviceURLKey,
            serviceAPIVersion,
            serviceEnvironmentURLKey,
            serviceModelURLKey,
            productTierURLKey,
            resourceParamter.urlKey,
            subscriptionId
          ).then((response) => {
            const ids = response.data.ids;
            resourceInstanceIds.push(
              ...ids.map((resourceInstanceId) => ({
                resourceInstanceId: resourceInstanceId,
                resourceKey: resourceParamter.urlKey,
              }))
            );
          });
        })
      );
      //All resource instance ids fetched

      const resourceInstances = [];

      await Promise.all(
        resourceInstanceIds.map(({ resourceInstanceId, resourceKey }) => {
          return getResourceInstanceDetails(
            serviceProviderId,
            serviceURLKey,
            serviceAPIVersion,
            serviceEnvironmentURLKey,
            serviceModelURLKey,
            productTierURLKey,
            resourceKey,
            resourceInstanceId,
            subscriptionId
          ).then((response) => {
            const resourceInstance = response.data;
            resourceInstances.push(resourceInstance);
          });
        })
      );
      setResourceInstances(resourceInstances);
      return resourceInstances;
    },
    {
      enabled: isQueryEnabled,
      retry: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchInterval: 60000,
      onError: (error) => {
        console.error(error?.response?.data);
      },
      select: (response) => {
        return { numResourceInstances: response.length };
      },
    }
  );

  return {
    resourceInstances: resourceInstances,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    numResourceInstances: query.data ? query.data.numResourceInstances : 0,
    isIdle: query.isIdle,
  };
}

export default useServiceOfferingResourceInstances;
