import { useQuery } from "@tanstack/react-query";
import { getServiceApiDocs } from "../api/service-api";

function useServiceApiDocsData(serviceId, serviceApiId, subscriptionId) {
  const query = useQuery(
    ["service-api-docs", serviceId, serviceApiId],
    () => {
      return getServiceApiDocs(serviceId, serviceApiId, subscriptionId);
    },
    {
      enabled: Boolean(serviceId && serviceApiId && subscriptionId),
      refetchOnWindowFocus: false,
      select: (response) => {
        return response.data;
      },
    }
  );

  return query;
}

export default useServiceApiDocsData;
