import { createSlice } from "@reduxjs/toolkit";

// 리덕스 슬라이스 생성
export const resultSlice = createSlice({
  name: "result",
  initialState: {
    isGame1Finished, // 로그인 상태
    isGame2Finished, // 로그인 상태
    isGame3Finished, // 로그인 상태
    isGame4Finished, // 로그인 상태
    isGame5Finished, // 로그인 상태
  },

  // 상태 수정 함수들
  reducers: {
    setGame1Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame1Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame1Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame1Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame1Finish: (state) => {
      state.isGame1Finished = true;
    },
  },
});

// 액션 생성자 내보내기
export const {
  setLoggedIn,
  setLoggedOut,
  setUserNo,
  setMemberId,
  setOpenViduToken,
} = authSlice.actions;

export default authSlice;
