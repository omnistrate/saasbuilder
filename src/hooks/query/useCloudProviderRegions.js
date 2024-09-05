import { useQuery } from "@tanstack/react-query";
import {
  getRegionById,
  getRegionIdsByCloudProviderWithParams,
} from "src/api/region";

function useCloudProviderRegions(
  serviceId,
  productTierId,
  cloudProviders,
  queryOptions = {}
) {
  const enabled = Boolean(
    cloudProviders?.length > 0 && serviceId && productTierId
  );
  const query = useQuery(
    ["cloud-providers-regions", serviceId, productTierId],
    async () => {
      const allRegionIds = [];
      const allRegionData = [];
      await Promise.all(
        cloudProviders.map((cloudProvider) => {
          return getRegionIdsByCloudProviderWithParams(
            serviceId,
            productTierId,
            cloudProvider
          ).then((response) => {
            const regionIds = response.data.ids;

            allRegionIds.push(...regionIds);
          });
        })
      );

      await Promise.all(
        allRegionIds.map((regionId) => {
          return getRegionById(regionId).then((response) => {
            allRegionData.push(response.data);
          });
        })
      );
      return allRegionData;
    },
    {
      enabled: enabled,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      select: (response) => {
        return response;
      },
      onError: (error) => {
        console.error(error);
      },
      ...queryOptions,
    }
  );
  return query;
}

export default useCloudProviderRegions;
