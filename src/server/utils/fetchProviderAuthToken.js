const axios = require("../axios");
const ProviderAuthError = require("./ProviderAuthError");

function fetchProviderAuthToken() {
  return axios
    .post("/signin", {
      email: `${process.env.PROVIDER_EMAIL}`,
      hashedPassword: `${process.env.PROVIDER_HASHED_PASS}`,
    })
    .catch((error) => {
      console.error(error)
      throw new ProviderAuthError();
    });
}

module.exports = {
  fetchProviderAuthToken,
};
