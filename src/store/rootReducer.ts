import { combineReducers } from "redux";

import authReducer from "./slices/authSlices";
import userReducer from "./slices/userSlices";
import companiesReducer from "./slices/companiesSlices";
import modelsSlices from "./slices/modelsSlices";
import playerSlices from "./slices/playerSlices";
// import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  auth: authReducer,
  user: userReducer,
  companies: companiesReducer,
  models: modelsSlices,
  player: playerSlices,
  // filters: filtersReducer
});

export default rootReducer;
