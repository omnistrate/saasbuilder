import { useQuery } from "@tanstack/react-query";
import { getServiceOffering } from "../api/serviceOffering";
import {
  getRegionById,
  getRegionIdsByCloudProviderWithParams,
} from "src/api/region";

async function fetchServiceOffering(serviceId, productTierId) {
  const response = await getServiceOffering(serviceId);
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

  if (
    offering.serviceModelType === "BYOA" &&
    offering.cloudProviders?.length <= 1
  ) {
    offering.cloudProviders = ["aws", "gcp"];
    const allRegionIds = [];
    const gcpRegions = [];
    await Promise.all(
      ["gcp"].map((cloudProvider) => {
        return getRegionIdsByCloudProviderWithParams(cloudProvider).then(
          (response) => {
            const regionIds = response.data.ids;
            allRegionIds.push(...regionIds);
          }
        );
      })
    );

    await Promise.all(
      allRegionIds.map((regionId) => {
        return getRegionById(regionId).then((response) => {
          gcpRegions.push(response.data.code);
        });
      })
    );
    offering.gcpRegions = [...gcpRegions];
  }

  return {
    ...restData,
    ...offering,
  };
}

function useServiceOffering(serviceId, productTierId) {
  const query = useQuery(
    ["marketplace-service", serviceId],
    () => fetchServiceOffering(serviceId, productTierId),
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
