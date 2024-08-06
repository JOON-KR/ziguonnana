import { createSlice } from "@reduxjs/toolkit";

//리덕스 툴킷(RTK)에서는 상태 하나를 slice라고 부름
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userNo: 0, //총 인원 중 몇번째로 들어왔는지 입장 번호
    memberId: 0, //멤버 한명한명에게 부여된 고유의 id
    openViduToken: "",

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
