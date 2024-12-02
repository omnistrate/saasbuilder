import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  instanceListSummaryVisible: true,
  instanceDetailsSummaryVisible: true,
};

const genericSlice = createSlice({
  name: "generic",
  initialState,
  reducers: {
    toggleInstanceListSummaryVisibility: (state) => {
      state.instanceListSummaryVisible = !state.instanceListSummaryVisible;
    },
    toggleInstanceDetailsSummaryVisibility: (state) => {
      state.instanceDetailsSummaryVisible =
        !state.instanceDetailsSummaryVisible;
    },
  },
});

export const {
  toggleInstanceDetailsSummaryVisibility,
  toggleInstanceListSummaryVisibility,
} = genericSlice.actions;

export default genericSlice.reducer;

export const selectInstanceListSummaryVisibililty = (state) =>
  state.generic.instanceListSummaryVisible;

export const selectInstanceDetailsSummaryVisibililty = (state) =>
  state.generic.instanceDetailsSummaryVisible;
