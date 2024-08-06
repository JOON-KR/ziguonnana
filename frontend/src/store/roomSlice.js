import { createSlice } from "@reduxjs/toolkit";

// Redux Toolkit (RTK)에서 상태 관리를 위한 slice 생성
export const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomId: "",
    teamCode: "",
    session: null, // OpenVidu 세션
    publisher: null, // OpenVidu 퍼블리셔
    subscribers: [], // 구독자 리스트
    maxNo: 0,
  },

  // 상태 수정 함수들
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setTeamCode: (state, action) => {
      state.teamCode = action.payload;
    },
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setPublisher: (state, action) => {
      state.publisher = action.payload;
    },
    addSubscriber: (state, action) => {
      state.subscribers.push(action.payload);
    },
    clearSession: (state) => {
      state.session = null;
      state.publisher = null;
      state.subscribers = [];
    },
    setMaxNo: (state, action) => {
      state.maxNo = action.payload;
    },
  },
});

export const {
  setRoomId,
  setTeamCode,
  setSession,
  setPublisher,
  addSubscriber,
  clearSession,
  setMaxNo,
} = roomSlice.actions;

export default roomSlice.reducer;
