import { createSelector, createSlice } from "@reduxjs/toolkit";
import loadingStatuses from "../utils/constants/loadingStatuses";

export const providers = ["aws", "gcp"];

const initialState = {
  ids: {
    aws: [],
    gcp: [],
    azure: [],
  },
  accounts: {
    aws: {},
    gcp: {},
    azure: {},
  },
  accountsLoadingStatus: loadingStatuses.idle,
  idsLoadingStatus: loadingStatuses.idle,
};

const accountConfigSlice = createSlice({
  name: "accountConfig",
  initialState,
  reducers: {
    initialiseAccountConfigState: (state) => {
      (state.ids = initialState.ids),
        (state.accounts = initialState.accounts),
        (state.accountsLoadingStatus = initialState.accountsLoadingStatus),
        (state.idsLoadingStatus = initialState.idsLoadingStatus);
    },
    setAccountConfigIds: (state, action) => {
      const { provider, accountConfigIds } = action.payload;
      state.ids[provider] = accountConfigIds;
    },
    setAccountConfigIdsLoadingStatus: (state, action) => {
      const status = action.payload;
      state.idsLoadingStatus = status;
    },
    setAccount: (state, action) => {
      const data = action.payload.data;
      const accountId = data.id;
      const provider = action.payload.provider;
      data["cloudProvider"] = provider;
      state.accounts[provider][accountId] = {
        ...data,
        loadingStatus: loadingStatuses.success,
      };
    },
    setAccountData: (state, action) => {
      const data = action.payload.data;
      const accountId = data.id;
      state.accounts["AccountData"][accountId] = {
        ...data,
        loadingStatus: loadingStatuses.success,
      };
    },
    setAccountConfigLoadingStatus: (state, action) => {
      const status = action.payload;
      state.accountsLoadingStatus = status;
    },
    removeAccountConfig: (state, action) => {
      const { provider, id } = action.payload;
      const providerAccounts = state.accounts[provider];
      delete providerAccounts[id];
    },
  },
});

export const {
  setAccountConfigIds,
  setAccountConfigIdsLoadingStatus,
  setAccount,
  setAccountConfigLoadingStatus,
  initialiseAccountConfigState,
  removeAccountConfig,
} = accountConfigSlice.actions;

export default accountConfigSlice.reducer;

export const selectAccountConfigIdsLoadingStatus = (state) => {
  return state.accountConfig.idsLoadingStatus;
};

export const selectAccountConfigLoadingStatus = (state) => {
  return state.accountConfig.accountsLoadingStatus;
};

export const selectAccountIdsByProvider = (state, provider) => {
  if (!state.accountConfig.ids[provider]) {
    return [];
  }
  return state.accountConfig.ids[provider];
};

export const selectAccountByProvider = (state, provider) => {
  if (!state.accountConfig.accounts[provider]) {
    return [];
  }
  const account = [];
  if (provider === "aws") {
    const aws = Object.values(state.accountConfig.accounts)[0];
    account.push(...Object.values(aws));
  }
  if (provider === "gcp") {
    const gcp = Object.values(state.accountConfig.accounts)[1];

    account.push(...Object.values(gcp));
  }
  if (provider === "azure") {
    const azure = Object.values(state.accountConfig.accounts)[2];

    account.push(...Object.values(azure));
  }

  return account;
};

export const selectAccountData = createSelector(
  (state) => state.accountConfig.accounts,
  (accounts) => {
    const account = [];
    if (!accounts) {
      return account;
    }

    const aws = Object.values(accounts)[0];
    const gcp = Object.values(accounts)[1];
    const azure = Object.values(accounts)[2];

    if (aws) {
      account.push(
        ...Object.values(aws)?.sort((a, b) => {
          return a?.name > b?.name ? 1 : -1;
        })
      );
    }
    if (gcp) {
      account.push(
        ...Object.values(gcp)?.sort((a, b) => {
          return a?.name > b?.name ? 1 : -1;
        })
      );
    }
    if (azure) {
      account.push(
        ...Object.values(azure)?.sort((a, b) => {
          return a?.name > b?.name ? 1 : -1;
        })
      );
    }

    return account;
  }
);

export const selectAccountProviderData = createSelector(
  (state) => state.accountConfig.accounts,
  (accounts) => {
    let account = {};

    if (!accounts) {
      return account;
    }

    const aws = Object.values(accounts)[0];
    const gcp = Object.values(accounts)[1];
    const azure = Object.values(accounts)[2];
    if (aws) {
      for (const key in aws) {
        account = {
          ...account,
          [key]: "aws",
        };
      }
    }
    if (gcp) {
      for (const key in gcp) {
        account = {
          ...account,
          [key]: "gcp",
        };
      }
    }
    if (azure) {
      for (const key in azure) {
        account = {
          ...account,
          [key]: "azure",
        };
      }
    }

    return account;
  }
);

export const selectAccountDatanew = createSelector(
  (state) => state.accountConfig.accounts,
  (accounts) => {
    const account = [];
    if (!accounts) {
      return account;
    }

    const aws = Object.values(accounts)[0];
    const gcp = Object.values(accounts)[1];
    const azure = Object.values(accounts)[2];

    if (aws) {
      for (const [key, value] of Object.entries(aws)) {
        account.push({ [key]: value });
      }
    }
    if (gcp) {
      for (const [key, value] of Object.entries(gcp)) {
        account.push({ [key]: value });
      }
    }
    if (azure) {
      for (const [key, value] of Object.entries(azure)) {
        account.push({ [key]: value });
      }
    }

    return account;
  }
);
