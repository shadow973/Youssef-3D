import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  firstname: null,
  lastname: null,
  userid: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    flush(state) {
      return { ...initialState };
    },
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { flush, update } = userSlice.actions;

export default userSlice.reducer;
