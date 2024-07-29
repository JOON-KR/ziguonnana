import { configureStore } from "@reduxjs/toolkit";
import salarySlice from "./salary/salarySlice";

const store = configureStore({
  //사용할 상태들 등록
  reducer: {
    salary: salarySlice.reducer, //만든 slice를 임포트하고 .reducer을 붙여 등록해야 사용 가능
  },
});

export default store;
