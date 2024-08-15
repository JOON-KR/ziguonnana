import { createSlice } from "@reduxjs/toolkit";

export const nicknameSlice = createSlice({
  name: "nickname",
  initialState: {
    nicknameList: [],
  },
  reducers: {
    setNicknameList: (state, action) => {
      state.nicknameList = action.payload;
    },
  },
});

export const { setNicknameList } = nicknameSlice.actions;
export default nicknameSlice;
