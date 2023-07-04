import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  userInfo: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setToken, setUserInfo } = loginSlice.actions;

export default loginSlice.reducer;
