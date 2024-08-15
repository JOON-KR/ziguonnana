import { createSlice } from "@reduxjs/toolkit";

// state 하나를 slice라고 부름
export const salarySlice = createSlice({
  name: "salary",
  initialState: 3000000,

  //state 수정 함수들, 리턴값으로
  reducers: {
    increment: (state) => {
      return state + 100000;
    },
    decrement: (state) => {
      return state - 100000;
    },
    setSalary: (state, action) => {
      return action.payload;
    },
  },
});

// state 수정함수들 export할땐 .actions를 붙인다.
export const { increment, decrement, setSalary } = salarySlice.actions;

export default salarySlice;
