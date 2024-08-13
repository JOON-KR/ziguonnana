import { createSlice } from "@reduxjs/toolkit";

// 리덕스 슬라이스 생성
export const resultSlice = createSlice({
  name: "result",
  initialState: {
    isGame1Finished: false, // 로그인 상태
    isGame2Finished: false, // 로그인 상태
    isGame3Finished: false, // 로그인 상태
    isGame4Finished: false, // 로그인 상태
    isGame5Finished: false, // 로그인 상태
  },

  // 상태 수정 함수들
  reducers: {
    setGame1Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame2Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame3Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame4Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame5Finish: (state) => {
      state.isGame1Finished = true;
    },
  },
});

// 액션 생성자 내보내기
export const {
  setGame1Finish,
  setGame2Finish,
  setGame3Finish,
  setGame4Finish,
  setGame5Finish,
} = authSlice.actions;

export default authSlice;
