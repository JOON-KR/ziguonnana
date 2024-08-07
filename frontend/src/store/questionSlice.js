import { createSlice } from "@reduxjs/toolkit";

// 리덕스 슬라이스 생성
export const questionSlice = createSlice({
  name: "questions",
  initialState: {
    questionList: [],
  },

  // 상태 수정 함수들
  reducers: {
    setQuestionList: (state, action) => {
      state.questionList = action.payload;
    },
  },
});

// 액션 생성자 내보내기
export const { setQuestionList } = questionSlice.actions;

export default questionSlice;
