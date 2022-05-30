import axios from "axios";
import store from "./store/store";
import { refreshToken, logout } from "./store/slices/authSlices";
import { baseURL } from "./constant";

const refreshTokenPath = "/sessions/refresh";

const instance = axios.create({
  baseURL,
  timeout: 10000,
  // headers:
});

instance.interceptors.response.use(
  (response) => {
    console.log("Working");
    return response;
  },
  async (error) => {
    console.log("Error config", error.config);
    console.log("Error DATA", error);
    const state = store.getState();
    const originalRequest = error.config;
    const now = Math.ceil(Date.now() / 1000);
    const { refresh_token, access_token_expires_at } = state.auth;
    if (access_token_expires_at === null) return;
    console.log(" TOKEN expire in ", access_token_expires_at - now);
    // Prevent infinite loops
    console.log("originalRequest.url", originalRequest.url);
    const isError401AndRefreshPath =
      error.response.status === 401 && originalRequest.url === refreshTokenPath;

    if (isError401AndRefreshPath) {
      console.log("Prevent infinite Loop");
      return Promise.reject(error);
    }

    const tokenNotValidToAccessModelsDetails =
      originalRequest.url.includes("/modeles/") &&
      (error.response.status === 401 || error.response.status === 403);

    console.log(
      "tokenNotValidToAccessModelsDetails",
      tokenNotValidToAccessModelsDetails,
      originalRequest.url.includes("/modeles/")
    );
    if (tokenNotValidToAccessModelsDetails) {
      const { refresh_token, access_token_expires_at, companyid } = state.auth;
      console.log("REFRESHING TOKEN");

      return instance
        .put(refreshTokenPath, { refresh_token, companyid: companyid })
        .then((response) => {
          console.log("REFRESHED COMPANY access_token", response.data.data);
          store.dispatch(refreshToken(response.data.data));
          instance.defaults.headers["Authorization"] =
            " " + response.data.access_token;
          originalRequest.headers["Authorization"] = " " + response.data.access;

          return instance(originalRequest);
        })
        .catch((err) => {
          console.log("err refreshing tolen", err, err.response.data);
        });
    }

    console.log(" TOKEN expire in ", access_token_expires_at - now);
    if (error.response.status === 401) {
      console.log("TOKEN EXPIRED");
      if (refresh_token) {
        // exp date in token is expressed in seconds, while now() returns milliseconds:
        console.log(" expire at ", access_token_expires_at, "  now ", now);

        if (access_token_expires_at && access_token_expires_at < now) {
          console.log("ACCESS TOKEN EXPIRED");
          return instance
            .put(refreshTokenPath, { refresh_token })
            .then((response) => {
              store.dispatch(refreshToken(response.data.data));
              console.log("REFRESHED access_token", response.data.access);
              console.log("REFRESHED  refresh_token", response.data.refresh);

              instance.defaults.headers["Authorization"] =
                " " + response.data.access;
              originalRequest.headers["Authorization"] =
                " " + response.data.access;

              return instance(originalRequest);
            })
            .catch((err) => {
              console.log("err refreshing tolen", err, err.response.data);
            });
        } else {
          console.log("Refresh token is expired", access_token_expires_at, now);
          //redirect to login
        }
      } else {
        console.log("Refresh token not available.");
        // redirect to login
      }
    }
    // specific error handling done elsewhere
    console.log("2 error", error.response.data);
    console.log("2 Axios", error.response.status);
    console.log("2 Axios", error.response.headers);
    // throw error;
    return Promise.reject(error);
  }
);

// Do something before request is sent
instance.interceptors.request.use(
  function (config) {
    console.log("REQUESTING", config.url);
    const state = store.getState();
    const token = state.auth.access_token;
    if (token) {
      config.headers.Authorization = ` ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    console.log("ERROR !@#$", error);
    if (error.response) {
      // Request made and server responded
      console.log("1 Axios", error.response.data);
      console.log("1 Axios", error.response.status);
      console.log("1 Axios", error.response.headers);
    }
    return Promise.reject(error);
  }
);

export default instance;
