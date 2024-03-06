const axios = require("../axios");
const withProviderTokenExpirationHanding = require("../utils/withProviderTokenExpirationHandling");

function getEventsList() {
  return axios.get("/fleet/events");

}

function acknowledgeEvent(eventID) {
  return axios.delete(`/fleet/events/${eventID}`);

}

module.exports = {
  getEventsList: withProviderTokenExpirationHanding(getEventsList),
  acknowledgeEvent: withProviderTokenExpirationHanding(acknowledgeEvent),
};
