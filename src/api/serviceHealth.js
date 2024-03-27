import axios from "../axios";

export const getServiceHealth = () => {
  return axios.get(`/resource-instance/health`);
};
