import { useQuery } from "@tanstack/react-query";
import { getServiceOffering } from "../api/serviceOffering";
import useEnvironmentType from "./useEnvironmentType";

async function fetchServiceOffering(serviceId, productTierId, environmentType) {
  const response = await getServiceOffering(serviceId, environmentType);
  const { offerings, ...restData } = response.data;
  let offering = {};
  const offeringMatch = offerings.find((offering) => {
    return offering.productTierID === productTierId;
  });

  if (offeringMatch) {
    offering = { ...offeringMatch, isReleased: true };
  } else {
    offering.notAvailable = true;
    offering.isReleased = false;
  }

  return {
    ...restData,
    ...offering,
  };
}

function useServiceOffering(serviceId, productTierId) {
  const environmentType = useEnvironmentType();
  const query = useQuery(
    ["marketplace-service", serviceId],
    () => fetchServiceOffering(serviceId, productTierId, environmentType),
    {
      enabled: Boolean(serviceId),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      cacheTime: 0,
    }
  );
  return query;
}

export default useServiceOffering;
