import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slice/loginSlice";
import menuReducer from "../slice/menuSlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    menu: menuReducer,
  },
});
