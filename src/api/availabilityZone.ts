import axios from "../axios";

export function getAvailabilityZone(cloudProviderName, regionCode) {
  return axios.get(
    `/availability-zone/region/code/${regionCode}/cloud-provider/${cloudProviderName}`
  );
}
