import { useQuery } from "@tanstack/react-query";
import { listSubscriptionRequests } from "src/api/subscriptionRequests";

function useSubscriptionRequests(queryParams = {}, queryOptions = {}) {
  const query = useQuery(
    ["subscription-requests"],
    () => {
      return listSubscriptionRequests(queryParams);
    },
    {
      refetchOnWindowFocus: false,
      select: (response) => {
        return response.data;
      },
      ...queryOptions,
    }
  );

  return query;
}

export default useSubscriptionRequests;
