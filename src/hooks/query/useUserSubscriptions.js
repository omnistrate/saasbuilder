import { useQuery } from "@tanstack/react-query";
import { listSubscriptions } from "src/api/subscriptions";
import useEnvironmentType from "../useEnvironmentType";

const useUserSubscriptions = (queryParams = {}, queryOptions = {}) => {
  const { serviceId } = queryParams;
  const environmentType = useEnvironmentType();
  const subscriptionData = useQuery({
    queryKey: ["user-subscriptions", serviceId, environmentType],
    queryFn: () => listSubscriptions({ serviceId, environmentType }),
    select: (response) => {
      const subscriptions = response.data.subscriptions || [];

      return subscriptions;
    },
    ...queryOptions,
  });

  return subscriptionData;
};

export default useUserSubscriptions;
