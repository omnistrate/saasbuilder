import { useQuery } from "@tanstack/react-query";
import { getServiceOffering } from "../api/serviceOffering";

function useServiceOffering(serviceId, productTierId) {
  const query = useQuery(
    ["marketplace-service", serviceId],
    () => {
      return getServiceOffering(serviceId);
    },
    {
      enabled: Boolean(serviceId),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      cacheTime: 0,
      select: (response) => {
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
      },
    }
  );
  return query;
}

export default useServiceOffering;
