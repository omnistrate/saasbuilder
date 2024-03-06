import { useQuery } from "@tanstack/react-query";
import React from "react";
import { describeServiceOfferingById } from "src/api/serviceOffering";

function useServiceOfferingById(serviceId) {
  const isQueryEnabled = Boolean(serviceId);

  const query = useQuery(
    ["service-offering-marketplace", serviceId],
    () => {
      return describeServiceOfferingById(serviceId, { visibility: "PUBLIC" });
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
