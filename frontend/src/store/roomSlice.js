import { createSlice } from "@reduxjs/toolkit";

// 리덕스 슬라이스 생성
export const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomId: "", // 방 ID
    teamCode: "", // 팀 코드 (이제 사용하지 않음)
    session: null, // OpenVidu 세션
    publisher: null, // OpenVidu 퍼블리셔
    subscribers: [], // 구독자 리스트
    maxNo: 0, // 방장이 설정한 최대 인원수
    localStream: null, // 로컬 스트림
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
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
  },
});

// 액션 생성자 내보내기
export const {
  setRoomId,
  setTeamCode,
  setSession,
  setPublisher,
  addSubscriber,
  clearSession,
  setMaxNo,
  setLocalStream,
} = roomSlice.actions;

export default roomSlice.reducer;
