import { useQuery } from "@tanstack/react-query";
import { getServiceHealth } from "src/api/serviceHealth";

function useServiceHealth(queryOptions = {}) {
  const query = useQuery(["service-health"], getServiceHealth, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    select: (response) => response.data,
    onError: (error) => {
      console.error(error);
    },
    ...queryOptions,
  });

  return query;
}

export default useServiceHealth;
