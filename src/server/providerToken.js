//Save the provider token
let providerToken;

function setProviderToken(token) {
  providerToken = token;
}

function getProviderToken() {
  return providerToken;
}

module.exports = {
  setProviderToken,
  getProviderToken,
};
