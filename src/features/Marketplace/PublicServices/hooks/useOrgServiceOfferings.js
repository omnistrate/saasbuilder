import { useQuery } from "@tanstack/react-query";
import { listServiceOfferings } from "src/api/serviceOffering";
import providerConfig from "src/providerConfig";

const getAllCloudProvidersAcrossOfferings = (offerings) => {
  let allProviders = [];
  offerings?.forEach((offering) => {
    offering?.cloudProviders?.forEach((provider) => {
      if (!allProviders.includes(provider)) {
        allProviders.push(provider);
      }
    });
  });
  return allProviders;
};

const getServiceLogoURL = (offerings) => {
  return offerings?.find((offering) => offering?.serviceLogoURL)
    ?.serviceLogoURL;
};

const getServicePublicEnvironmentID = (offerings) => {
  return offerings?.find((offering) => offering?.serviceEnvironmentID)
    ?.serviceEnvironmentID;
};

function useOrgServiceOfferings(queryOptions = {}, queryConfig = {}) {
  const query = useQuery(
    ["org-service-offerings"],
    () => {
      return listServiceOfferings({
        visibility: "PUBLIC",
      });
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const services = data.data?.services || [];
        const serviceOfferings = [];

        services.forEach((service) => {
          service?.offerings.forEach((offering) => {
            const offeringData = {
              ...service,
              ...offering,
            };
            delete offeringData.offerings;

            serviceOfferings.push(offeringData);
          });
        });

        serviceOfferings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        return serviceOfferings;
      },
      ...queryConfig,
    }
  );

  return query;
}

export default useOrgServiceOfferings;
