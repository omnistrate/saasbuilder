import axios from "../axios";

export const getServiceOfferingIds = () => {
  return axios.get("/service-offering");
};

export const getServiceOffering = (serviceId, environmentType) => {
  const queryParams = {};
  if (environmentType) {
    queryParams["environmentType"] = environmentType;
  }
  
  return axios.get(`/service-offering/${serviceId}`, {
    params: queryParams,
  });
};

export const describeServiceOfferingResource = (
  serviceId,
  resourceId,
  instanceId = "none"
) => {
  return axios.get(
    `/service-offering/${serviceId}/resource/${resourceId}/instance/${instanceId}`
  );
};

export const listServiceOfferings = (query) => {
  return axios.get("/service-offering", {
    params: query,
  });
};

