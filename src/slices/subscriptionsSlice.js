import { createSlice } from "@reduxjs/toolkit";
import loadingStatuses from "../utils/constants/loadingStatuses";

const initialState = {
  subscriptions: {},
  productTierIds: [],
  subscriptionsIds: [],
  subscriptionsIdsLoadingStatus: loadingStatuses.idle,
  subscriptionsLoadingStatus: loadingStatuses.idle,
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    initialiseSubscriptions: (state) => {
      state.subscriptions = initialState.subscriptions;
      state.productTierIds = initialState.productTierIds;
      state.subscriptionsIds = initialState.subscriptionsIds;
      state.subscriptionsIdsLoadingStatus =
        initialState.subscriptionsIdsLoadingStatus;
      state.subscriptionsLoadingStatus =
        initialState.subscriptionsLoadingStatus;
    },
    setSubscriptions: (state, action) => {
      const { id, productTierId } = action.payload;
      state.productTierIds.push(productTierId);
      state.subscriptions[id] = action.payload;
    },
    setProductTierIds: (state, action) => {
      state.productTierIds = action.payload;
    },
    setSubscriptionsIds: (state, action) => {
      state.subscriptionsIds = action.payload;
    },
    setSubscriptionsIdsLoadingStatus: (state, action) => {
      state.subscriptionsIdsLoadingStatus = action.payload;
    },
    setSubscriptionsLoadingStatus: (state, action) => {
      state.subscriptionsLoadingStatus = action.payload;
    },
  },
});

export const {
  initialiseSubscriptions,
  setSubscriptions,
  setProductTierIds,
  setSubscriptionsIds,
  setSubscriptionsIdsLoadingStatus,
  setSubscriptionsLoadingStatus,
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;

export const selectProductTierIds = (state) => {
  const data = state.subscriptions.productTierIds;
  return data;
};



const serviceByIds = (service) => {
  const serviceData = {};
  service.map((obj) => {
    serviceData[obj.serviceId] = obj;
  });
  return serviceData;
};

const productTierByIds = (productdata) => {
  const productTierData = {};
  productdata?.map((obj) => {
    productTierData[obj.productTierID] = obj;
  });
  return productTierData;
};

export const selectSubscriptions = (state) => {
  const data = [];
  const subIds = state.subscriptions.subscriptionsIds;
  const services = Object.values(state.marketplaceServices.allService);
  const servicesData = serviceByIds(services);

  subIds.map((subId) => {
    const subobj = {};
    const subData = state.subscriptions.subscriptions[subId];
    if (subData && servicesData) {
      const serviceData = servicesData[subData?.serviceId];
      subobj["serviceName"] = serviceData?.serviceName;
      subobj["serviceLogoURL"] = serviceData?.serviceLogoURL;
      subobj["serviceId"] = serviceData?.serviceId;
      subobj["envKey"] = serviceData?.serviceEnvironmentURLKey;
      const productdata = productTierByIds(serviceData?.servicePlans);
      const servicePlanData = productdata[subData?.productTierId];
      const modelType = servicePlanData?.serviceModelTypeCustom
        ? servicePlanData?.serviceModelTypeCustom
        : "";
      const tier = servicePlanData?.productTierName
        ? servicePlanData?.productTierName
        : "";
      subobj["productTierId"] = servicePlanData?.productTierID;
      subobj["productTierName"] = servicePlanData?.productTierName;
      subobj["typeOfService"] = `${modelType}:${tier}`;
      subobj["id"] = subId;
      subobj["cloudProviders"] = servicePlanData?.cloudProviders;
      data.push(subobj);
    }
  });
  return data;
};
