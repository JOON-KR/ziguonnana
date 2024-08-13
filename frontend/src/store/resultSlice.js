import { createSlice } from "@reduxjs/toolkit";

// 리덕스 슬라이스 생성
export const resultSlice = createSlice({
  name: "result",
  initialState: {
    isGame1Finished: false,
    isGame2Finished: false,
    isGame3Finished: false,
    isGame4Finished: false,
    isGame5Finished: false,
  },

  // 상태 수정 함수들
  reducers: {
    setGame1Finish: (state) => {
      state.isGame1Finished = true;
    },
    setGame2Finish: (state) => {
      state.isGame2Finished = true;
    },
    setGame3Finish: (state) => {
      state.isGame3Finished = true;
    },
    setGame4Finish: (state) => {
      state.isGame4Finished = true;
    },
    setGame5Finish: (state) => {
      state.isGame5Finished = true;
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
} = resultSlice.actions;

export default resultSlice;
