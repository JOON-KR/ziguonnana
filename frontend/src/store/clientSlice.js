import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
  name: "client",
  initialState: {
    stompClient: null,
  },
  reducers: {
    setStompClient: (state, action) => {
      state.stompClient = action.payload;
    },
  },
});

export const { setStompClient } = clientSlice.actions;
export default clientSlice;
