import axios from "../axios";

export function getRegionIdsByCloudProviderWithParams(
  cloudProviderName,
  serviceId = "",
  serviceModelId = "",
  modelType = ""
) {
  const queryParams = {};
  if (serviceId && serviceModelId) {
    queryParams["serviceId"] = serviceId;
    queryParams["serviceModelId"] = serviceModelId;
  }
  if (modelType) {
    queryParams["modelType"] = modelType;
  }
  return axios.get(`/region/cloudprovider/${cloudProviderName}`, {
    params: queryParams,
  });
}

export function getRegionById(regionId) {
  return axios.get(`/region/${regionId}`);
}
