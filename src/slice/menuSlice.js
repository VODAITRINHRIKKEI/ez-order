import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryItem: {},
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectCategoryItem: (state, action) => {
      state.categoryItem = action.payload;
    },
  },
});

export const { setSelectCategoryItem } = menuSlice.actions;

export default menuSlice.reducer;
