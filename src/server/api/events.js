const axios = require("../axios");
const ProviderAuthError = require("../utils/ProviderAuthError");
const withProviderTokenExpirationHanding = require("../utils/withProviderTokenExpirationHandling");

function getEventsList() {
  return axios.get("/fleet/events").catch((error) => {
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
