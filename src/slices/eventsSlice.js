import { createSelector, createSlice } from "@reduxjs/toolkit";
import loadingStatuses from "../utils/constants/loadingStatuses";

const initialState = {
  serviceId: "",
  environmentURLKey: "",
  eventIds: [],
  eventIdsLoadingStatus: loadingStatuses.idle,
  events: {},
  eventsLoadingStatus: loadingStatuses.idle,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEventsServiceAndEnv: (state, action) => {
      const { serviceId, environmentURLKey } = action.payload;
      if (
        state.serviceId !== serviceId ||
        state.environmentURLKey !== environmentURLKey
      ) {
        state.serviceId = serviceId;
        state.environmentURLKey = environmentURLKey;
        state.eventIds = [];
        state.events = [];
      }
    },
    initialiseEvents: (state, action) => {
      state.eventIds = initialState.eventIds;
      state.eventIdsLoadingStatus = initialState.eventIdsLoadingStatus;
      state.events = initialState.events;
      state.eventsLoadingStatus = initialState.eventsLoadingStatus;
      //console.log("Inside initialise events")
    },
    setEventIds: (state, action) => {
      const { serviceId, environmentURLKey, eventIds } = action.payload;
      if (
        state.serviceId === serviceId &&
        state.environmentURLKey === environmentURLKey
      ) {
        state.eventIds = eventIds;
      }
    },
    setEventIdsLoadingStatus: (state, action) => {
      const { serviceId, environmentURLKey, status } = action.payload;
      if (
        state.serviceId === serviceId &&
        state.environmentURLKey === environmentURLKey
      ) {
        state.eventIdsLoadingStatus = status;
      }
    },
    setEvents: (state, action) => {
      const { serviceId, environmentURLKey, events } = action.payload;
      if (
        state.serviceId === serviceId &&
        state.environmentURLKey === environmentURLKey
      ) {
        state.events = events;
      }
    },
    setEventsLoadingStatus: (state, action) => {
      const { serviceId, environmentURLKey, status } = action.payload;
      if (
        state.serviceId === serviceId &&
        state.environmentURLKey === environmentURLKey
      ) {
        state.eventsLoadingStatus = status;
      }
    },
  },
});

export const {
  initialiseEvents,
  setEventIds,
  setEventIdsLoadingStatus,
  setEvents,
  setEventsLoadingStatus,
  setEventsServiceAndEnv,
} = eventsSlice.actions;

export default eventsSlice.reducer;

export const selectEventsLoadingStatus = (state) =>
  state.events.eventsLoadingStatus;

export const selectEvents = createSelector(
  (state) => state.events.events,
  (events) => {
    return Object.values(events).sort((event1, event2) => {
      const time1 = new Date(event1.time);
      const time2 = new Date(event2.time);
      return time2 - time1;
    });
  }
);
