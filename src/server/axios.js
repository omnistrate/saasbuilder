const Axios = require("axios");

//get backend base url
const { baseURL } = require("../axios");
const { getProviderToken } = require("./providerToken");

//The server axios is different from the client axios instance
//This will use service provider's JWT token for auth
const axios = Axios.create({
  baseURL,
});

axios.interceptors.request.use((config) => {
  // if (config.headers.Authorization === undefined) {
  const providerAuthToken = getProviderToken();
  if (providerAuthToken) {
    config.headers.Authorization = `Bearer ${providerAuthToken}`;
    // axios.defaults.headers["Authorization"] = `Bearer ${providerAuthToken}`;
  }
  // }
  return config;
});

module.exports = axios;
