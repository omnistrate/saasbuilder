import { createSlice } from "@reduxjs/toolkit";
import loadingStatuses from "../utils/constants/loadingStatuses";

const initialState = {
  resourceInstanceList: [],
  resourceInstanceListLoadingStatus: loadingStatuses.idle,
};

const resourceInstanceListSlice = createSlice({
  name: "resourceInstanceList",
  initialState,
  reducers: {
    setResourceInstanceList: (state, action) => {
      state.resourceInstanceList = action.payload;
    },
    setResourceInstanceListLoadingStatus: (state, action) => {
      state.resourceInstanceListLoadingStatus = action.payload;
    },
    setResourceInstanceListToEmpty: (state) => {
      state.resourceInstanceList = [];
    },
  },
});

export const {
  setResourceInstanceList,
  setResourceInstanceListLoadingStatus,
  setResourceInstanceListToEmpty,
} = resourceInstanceListSlice.actions;

export default resourceInstanceListSlice.reducer;

export const selectResourceInstanceList = (state) =>
  state.resourceInstanceList.resourceInstanceList;

export const selectResourceInstanceListLoadingStatus = (state) =>
  state.resourceInstanceList.resourceInstanceListLoadingStatus;
