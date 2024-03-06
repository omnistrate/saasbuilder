import { useQuery } from "@tanstack/react-query";
import { getUsersBySubscription } from "src/api/users";

const useSubscriptionUsers = (queryParams = {}, queryOptions = {}) => {
  const { subscriptionId } = queryParams;
  const isEnabled = Boolean(subscriptionId);
  const subscriptionData = useQuery({
    enabled: isEnabled,
    queryKey: ["subscription-users", subscriptionId],
    queryFn: () => getUsersBySubscription(subscriptionId),
    select: (response) => {
      return response.data;
    },
    ...queryOptions,
  });

  return subscriptionData;
};

export default useSubscriptionUsers;
