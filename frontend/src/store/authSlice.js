import { createSlice } from "@reduxjs/toolkit";

//리덕스 툴킷(RTK)에서는 상태 하나를 slice라고 부름
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userNo: 0, //방에 입장한 순서
    memberId: 0, //오픈비두 연결하면 받는 토큰. 이거로 소켓 연결할떄 사용
    openViduToken: "", //오픈비두 연결하면 받는 토큰.나중에 영상 띄울 떄 사용

    // accessToken: null,
  },

  //state 수정 함수들, 리턴값으로 상태 변수 설정
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.accessToken = action.payload;
    },
    setLoggedOut: (state, action) => {
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

export const {
  setLoggedIn,
  setLoggedOut,
  setUserNo,
  setMemberId,
  setOpenViduToken,
} = authSlice.actions;

export default authSlice;
