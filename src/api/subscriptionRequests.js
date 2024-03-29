import axios from "../axios";

export const listSubscriptionRequests = (query) => {
  return axios.get("/subscription/request", {
    params: query,
  });
};

export const createSubscriptionRequest = (body) => {
  return axios.post("/subscription/request", body);
};

export const cancelSubscriptionRequest = (requestId) => {
  return axios.delete(`/subscription/request/${requestId}`);
};
