import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
};

export const loginSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken } = loginSlice.actions;

export default loginSlice.reducer;
