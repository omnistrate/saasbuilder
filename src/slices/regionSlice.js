import { createSelector, createSlice } from "@reduxjs/toolkit";
import loadingStatuses from "../utils/constants/loadingStatuses";

const initialState = {
  regionIds: [],
  regions: {},
  loadingStatus: loadingStatuses.idle,
  idsLoadingStatus: loadingStatuses.idle,
};

const regionsSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    initialiseRegions: (state) => {
      state.regionIds = initialState.regionIds;
      state.regions = initialState.regions;
      state.loadingStatus = initialState.loadingStatus;
      state.idsLoadingStatus = initialState.idsLoadingStatus;
    },
    setRegionIds: (state, action) => {
      const regionIds = action.payload;
      state.regionIds = [...state.regionIds, ...regionIds];
    },
    setRegionIdsLoadingStatus: (state, action) => {
      const status = action.payload;
      state.idsLoadingStatus = status;
    },
    setRegion: (state, action) => {
      const data = action.payload;
      const regionId = data.id;
      state.regions[regionId] = {
        ...data,
      };
    },
    setRegionsLoadingStatus: (state, action) => {
      const status = action.payload;
      state.loadingStatus = status;
    },
  },
});

export const {
  initialiseRegions,
  setRegion,
  setRegionIds,
  setRegionIdsLoadingStatus,
  setRegionsLoadingStatus,
} = regionsSlice.actions;

export default regionsSlice.reducer;

export const selectAllRegions = createSelector(
  (state) => state.region.regions,
  (regions) => {
    return Object.values(regions);
  }
);
