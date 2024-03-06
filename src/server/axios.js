const Axios = require("axios");

//get backend base url
const { baseURL } = require("../axios");
const { getProviderToken } = require("./providerToken");

//The server axios is different from the client axios instance
//This will use service provider's JWT token for auth
const axios = Axios.create({
  baseURL,
});

const providerToken = getProviderToken();
if (providerToken) {
  axios.defaults.headers.Authorization = `${Bearer} ${providerToken}`;
}

module.exports = axios;
