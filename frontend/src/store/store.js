import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
  //사용할 상태들 등록
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
