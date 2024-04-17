import { useQuery } from "@tanstack/react-query";
import { getCloudProviderCustomRegion } from "src/api/region";

export default function useCloudProvidersCustomRegions(
  regionCode = "ca-central-1",
  cloudProviderName = "aws",
  queryOptions = {}
) {
  const isQueryEnabled = Boolean(regionCode && cloudProviderName);
  const query = useQuery(
    ["cloud-providers-custom-regions", regionCode, cloudProviderName],
    async () => {
      const response = await getCloudProviderCustomRegion(
        cloudProviderName,
        regionCode
      );

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
