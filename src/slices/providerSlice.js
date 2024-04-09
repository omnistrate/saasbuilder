import { createSelector, createSlice } from "@reduxjs/toolkit";
import loadingStatuses from "../utils/constants/loadingStatuses";
import AwsLogo from '../../public/assets/images/logos/aws.svg'
import GcpLogo from '../../public/assets/images/logos/gcpCloud.svg'
import AzureLogo from '../../public/assets/images/logos/azure.svg'

const initialState = {
  providers: {},
  providerIds: [],
  providerIdsLoadingStatus: loadingStatuses.idle,
  providerLoadingStatus: loadingStatuses.idle,
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    initialiseClouseProviders: (state, action) => {
      state.providerIds = [];
      state.providers = {};
    },
    setProviderIds: (state, action) => {
      state.providerIds = action.payload;
    },
    setProviderIdsLoadingStatus: (state, action) => {
      state.providerIdsLoadingStatus = action.payload;
    },
    setProvider: (state, action) => {
      const providerId = action.payload.id;
      state.providers[providerId] = {
        ...action.payload,
        loadingStatus: loadingStatuses.success,
      };
    },
    setProviderLoadingStatus: (state, action) => {
      state.providerLoadingStatus = action.payload;
    },
  },
});

export const {
  setProviderIds,
  setProviderIdsLoadingStatus,
  setProvider,
  setProviderLoadingStatus,
  initialiseClouseProviders,
} = providerSlice.actions;

export default providerSlice.reducer;

export const selectProviderLoadingStatus = (state) =>
  state.provider.providerLoadingStatus;

export const selectProvider = (state) => {
  return Object.values(state.provider.providers);
  // return state.provider.providers;
};

export const selectProviderNameById = (state, cloudProviderId) => {
  const providerObj = Object.values(state.provider.providers[cloudProviderId]);

  return providerObj.name;
  // return state.provider.providers;
};

export const selectCloudProviderNames = createSelector(
  (state) => state.provider.providers,
  (providers) => {
    const cloudProviders = Object.values(providers).map(
      (cloudProvider) => cloudProvider.name
    );

    return cloudProviders.sort();
  }
);

export const selectAwsEnabledStatus = (state) => {
  const cloudProvidersArr = Object.values(state.provider.providers);
  const aws = cloudProvidersArr.find((provider) => provider.name === "aws");
  return Boolean(aws);
};

export const selectGcpEnabledStatus = (state) => {
  const cloudProvidersArr = Object.values(state.provider.providers);
  const gcp = cloudProvidersArr.find((provider) => provider.name === "gcp");
  return Boolean(gcp);
};

export const selectAzureEnabledStatus = (state) => {
  const cloudProvidersArr = Object.values(state.provider.providers);
  const azure = cloudProvidersArr.find((provider) => provider.name === "azure");
  return Boolean(azure);
};

const iconMapping = { 'gcp': GcpLogo, 'aws': AwsLogo, 'azure': AzureLogo };
export const selectCloudProviders = createSelector(
  (state) => state.provider.providers,
  (providers) => {
    const cloudProviders = Object.values(providers);

    return [...cloudProviders].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }).map((provider) => ({ ...provider, icon: iconMapping[provider.name] || null }));
  }
);

export const selectAWSProviderId = (state) => {
  let providerId = null;
  const awsProvider = Object.values(state.provider.providers).find(
    (provider) => provider.name === "aws"
  );
  if (awsProvider) {
    providerId = awsProvider.id;
  }

  return providerId;
};

export const selectGCPProviderId = (state) => {
  let providerId = null;
  const gcpProvider = Object.values(state.provider.providers).find(
    (provider) => provider.name === "gcp"
  );
  if (gcpProvider) {
    providerId = gcpProvider.id;
  }

  return providerId;
};

export const selectCloudProviderDescriptionById = (state, providerId) => {
  let description = "";
  const provider = state.provider.providers[providerId];
  if (provider) {
    description = provider.description;
  }
  return description;
};
