import { useQuery } from "@tanstack/react-query";
import { getServiceOffering } from "src/api/serviceOffering";
import useEnvironmentType from "src/hooks/useEnvironmentType";

function useServiceOfferingById(serviceId) {
  const isQueryEnabled = Boolean(serviceId);
  const environmentType = useEnvironmentType();
  const query = useQuery(
    ["service-offering-marketplace", serviceId],
    () => {
      return getServiceOffering(serviceId, environmentType);
    },
    {
      enabled: isQueryEnabled,
      refetchOnWindowFocus: false,
      select: (response) => {
        return response.data;
      },
    }
  );

  return query;
}

export default useServiceOfferingById;
