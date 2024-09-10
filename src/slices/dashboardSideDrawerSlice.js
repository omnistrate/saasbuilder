import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isExpanded: true,
};

const dashboardSideDrawerSlice = createSlice({
  name: "dashboardSidebar",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isExpanded = !state.isExpanded;
    },
  },
});

export const { toggleDrawer } = dashboardSideDrawerSlice.actions;

export default dashboardSideDrawerSlice.reducer;

export const selectDrawerExpandedState = (state) => state.sideDrawer.isExpanded;
