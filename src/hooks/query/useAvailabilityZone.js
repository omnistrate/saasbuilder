import { useQuery } from "@tanstack/react-query";
import { getAvailabilityZone } from "src/api/availabilityZone";

export default function useAvailabilityZone(
  regionCode,
  cloudProviderName,
  queryOptions = {}
) {
  const isQueryEnabled = Boolean(regionCode && cloudProviderName);
  const query = useQuery(
    ["cloud-providers-custom-regions", regionCode, cloudProviderName],
    async () => {
      const response = await getAvailabilityZone(cloudProviderName, regionCode);

      return response;
    },
    {
      enabled: isQueryEnabled,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      select: (response) => {
        return response.data;
      },
      onError: (error) => {
        console.error(error);
      },
      ...queryOptions,
    }
  );

  return query;
}
