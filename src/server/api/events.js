const axios = require("../axios");
const ProviderAuthError = require("../utils/ProviderAuthError");
const withProviderTokenExpirationHanding = require("../utils/withProviderTokenExpirationHandling");

function getEventsList(environmentType) {
  const queryParams = {};

  if (environmentType) {
    queryParams["environmentType"] = environmentType;
  }

  return axios.get("/fleet/events", { params: queryParams }).catch((error) => {
    console.log("List events error");
    if (error.response && error.response.status === 401) {
      throw new ProviderAuthError();
    } else {
      throw error;
    }
  });
}

function acknowledgeEvent(eventID) {
  return axios.delete(`/fleet/events/${eventID}`).catch((error) => {
    console.log("Acknowledge event error");
    if (error.response && error.response.status === 401) {
      throw new ProviderAuthError();
    } else {
      throw error;
    }
  });
}

module.exports = {
  getEventsList: withProviderTokenExpirationHanding(getEventsList),
  acknowledgeEvent: withProviderTokenExpirationHanding(acknowledgeEvent),
};
