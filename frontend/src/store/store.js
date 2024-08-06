import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { roomSlice } from "./roomSlice";
import clientSlice from "./clientSlice";

const store = configureStore({
  //사용할 상태들 등록
  reducer: {
    auth: authSlice.reducer,
    room: roomSlice.reducer,
    client: clientSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
