import { createSlice } from "@reduxjs/toolkit";

import loadingStatuses from "../utils/constants/loadingStatuses";

const initialState = {
  publicServices: {},
  allService: {},
  loadingStatus: loadingStatuses.loading,
};

const servicesMarketplaceSlice = createSlice({
  name: "inputParams",
  initialState,
  reducers: {
    initialiseMarketplaceServices: (state) => {
      state.loadingStatus = initialState.loadingStatus;
      state.allService = initialState.allService;
    },
    initMarketplaceServices: (state) => {
      state.loadingStatus = initialState.loadingStatus;
      state.allService = initialState.allService;
    },
    setMarketplaceService: (state, action) => {
      const { data } = action.payload;
      state.allService = { ...state.allService, ...data };
    },
    setMarketplaceServicesLoadingStatus: (state, action) => {
      const status = action.payload;
      state.loadingStatus = status;
    },
  },
});

export const {
  initMarketplaceServices,
  setMarketplaceService,
  setMarketplaceServicesLoadingStatus,
  initialiseMarketplaceServices,
} = servicesMarketplaceSlice.actions;

export default servicesMarketplaceSlice.reducer;

export const selectMarketplaceServicesLoadingStatus = (state) =>
  state.marketplaceServices.loadingStatus;

export const selectMarketplaceServices = (state) => {
  const services = Object.values(state.marketplaceServices.allService);
  services.sort((a, b) => {
    if (a.serviceName < b.serviceName) return -1;
    else return 1;
  });
  return services;
};

export const selectServiceByEnvId = (state, envId) => {
  if (envId) return state.marketplaceServices.allService[envId];
  else return null;
};

export const selectServiceByEnvIdProductTierId = (
  state,
  envId,
  productTierId
) => {
  let data = {};
  const envData = state.marketplaceServices.allService[envId];
  envData?.servicePlans?.map((servicePlan) => {
    if (servicePlan.productTierID === productTierId) {
      data = servicePlan;
    }
  });
  return data;
};
