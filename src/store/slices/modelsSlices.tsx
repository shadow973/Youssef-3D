import { createSlice } from "@reduxjs/toolkit";

const initialState = { allModels: [] };

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    flushModels(state) {
      return { ...initialState };
    },
    updateModels(state, action) {
      return { ...state, allModels: action.payload };
    },
  },
});

export const { flushModels, updateModels } = modelsSlice.actions;

export default modelsSlice.reducer;
