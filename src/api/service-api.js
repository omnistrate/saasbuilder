import axios, { baseURL } from "../axios";

export const downloadCLI = (serviceId, serviceApiId, subscriptionId) => {
  const queryParams = {};
  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }
  return axios.get(
    `${baseURL}/service/${serviceId}/service-api/${serviceApiId}/cli`,
    {
      responseType: "blob",
      params: queryParams,
    }
  );
};

export const getServiceApiDocs = (serviceId, serviceApiId, subscriptionId) => {
  const queryParams = {};
  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }
  return axios.get(
    `/service/${serviceId}/service-api/${serviceApiId}/swagger_spec`,
    { params: queryParams }
  );
};
