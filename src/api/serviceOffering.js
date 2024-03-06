import axios from "../axios";

export const getServiceOfferingIds = () => {
  return axios.get("/service-offering");
};

export const getServiceOffering = (serviceId) => {
  return axios.get(`/service-offering/${serviceId}`);
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

export const describeServiceOfferingById = (serviceId, query) => {
  return axios.get(`service-offering/${serviceId}`, {
    params: query,
  });
};
