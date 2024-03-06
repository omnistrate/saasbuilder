import { useQuery } from "@tanstack/react-query";
import { getUserSubscriptions } from "src/api/subscriptions";

const useUserSubscriptions = (queryOptions = {}) => {
  const subscriptionData = useQuery({
    queryKey: ["user-subscriptions"],
    queryFn: () => getUserSubscriptions(),
    select: (response) => {
      const subscriptions = response.data.subscriptions || [];
   
      return subscriptions;
    },
    ...queryOptions,
  });

  return subscriptionData;
};

export default useUserSubscriptions;
