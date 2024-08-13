import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { roomSlice } from "./roomSlice";
import clientSlice from "./clientSlice";
import nicknameSlice from "./nicknameSlice";
import drawingSlice from "./drawingSlice";
import questionSlice from "./questionSlice";
import messageSlice from "./messageSlice";
import { resultSlice } from "./resultSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    room: roomSlice.reducer,
    client: clientSlice.reducer,
    nickname: nicknameSlice.reducer,
    drawing: drawingSlice.reducer,
    question: questionSlice.reducer,
    message: messageSlice.reducer,
    result: resultSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
