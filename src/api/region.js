import axios from "../axios";

export function getRegionIdsByCloudProviderWithParams(
  cloudProviderName,
  serviceId,
  serviceModelId
) {
  return axios.get(
    `/region/cloudprovider/${cloudProviderName}?serviceId=${serviceId}&serviceModelId=${serviceModelId}`
  );
}

export function getRegionById(regionId) {
  return axios.get(`/region/${regionId}`);
}
