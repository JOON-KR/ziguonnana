import { createSlice } from "@reduxjs/toolkit";

//리덕스 툴킷(RTK)에서는 상태 하나를 slice라고 부름
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userNo: 0,
    memberId: 0,

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
  },
});

export const { setLoggedIn, setLoggedOut } = authSlice.actions;

export default authSlice;
