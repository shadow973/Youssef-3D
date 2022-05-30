import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companies: null,
};

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    flushCompanies(state) {
      return { ...initialState };
    },
    updateCompanies(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { flushCompanies, updateCompanies } = companiesSlice.actions;

export default companiesSlice.reducer;
