import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "client",
  initialState: {
    message: {},
  },
  reducers: {
    setMessage: (state, action) => {
      state.stompClient = action.payload;
    },
  },
});

export const { setMessage } = messageSlice.actions;
export default messageSlice;
