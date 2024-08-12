import { createSlice } from "@reduxjs/toolkit";

// 리덕스 슬라이스 생성
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false, // 로그인 상태
    userNo: 1, // 방에 입장한 순서
    memberId: 0, // 오픈비두 연결 시 받은 멤버 ID
    openViduToken: "", // 오픈비두 연결 시 받은 토큰
  },

  // 상태 수정 함수들
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.accessToken = action.payload;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
    },
    setUserNo: (state, action) => {
      state.userNo = action.payload;
    },
    setMemberId: (state, action) => {
      state.memberId = action.payload;
    },
    setOpenViduToken: (state, action) => {
      state.openViduToken = action.payload;
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
