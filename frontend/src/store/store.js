import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { roomSlice } from "./roomSlice";
import clientSlice from "./clientSlice";
import nicknameSlice from "./nicknameSlice";
import questionSlice from "./questionSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    room: roomSlice.reducer,
    client: clientSlice.reducer,
    nickname: nicknameSlice.reducer,
    question: questionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
