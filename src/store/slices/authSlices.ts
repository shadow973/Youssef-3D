import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
  access_token_expires_in: null,
  access_token_expires_at: null,
  refresh_token: null,
  refresh_token_expires_in: null,
  userid: null,
  companyid: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      // ✅ This "mutating" code is okay inside of createSlice!
      console.log("Login", action.payload);
      console.log(
        "Access Token expire in ",
        Math.ceil(Date.now() / 1000) + action.payload.access_token_expires_in
      );
      return {
        ...action.payload,
        access_token_expires_at:
          Math.ceil(Date.now() / 1000) + action.payload.access_token_expires_in,
      };
    },
    logout(state) {
      return { ...initialState };
    },
    refreshToken(state, action) {
      return { ...state, ...action.payload };
    },
    refreshCompanyId(state, action) {
      return { ...state, companyid: action.payload };
    },
  },
});

export const { login, logout, refreshToken, refreshCompanyId } =
  authSlice.actions;

export default authSlice.reducer;
