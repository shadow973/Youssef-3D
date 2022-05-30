import { createSlice } from "@reduxjs/toolkit";

const initialState = { play: false };

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    flushModels(state) {
      return { ...initialState };
    },
    setPlay(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { flushModels, setPlay } = playerSlice.actions;

export default playerSlice.reducer;
