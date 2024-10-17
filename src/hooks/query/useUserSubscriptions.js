import { useQuery } from "@tanstack/react-query";
import { listSubscriptions } from "src/api/subscriptions";

const useUserSubscriptions = (queryParams = {}, queryOptions = {}) => {
  const { serviceId } = queryParams;

  const subscriptionData = useQuery({
    queryKey: ["user-subscriptions"],
    queryFn: () => listSubscriptions({ serviceId }),
    select: (response) => {
      const subscriptions = response.data.subscriptions || [];

      return subscriptions;
    },
    ...queryOptions,
  });

  return subscriptionData;
};

export default useUserSubscriptions;
