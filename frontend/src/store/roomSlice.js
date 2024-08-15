import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomId: "", // 방 ID
    session: null, // OpenVidu 세션
    publisher: null, // OpenVidu 퍼블리셔
    subscribers: [], // 구독자 리스트
    maxNo: 0, // 방장이 설정한 최대 인원수
    localStream: null, // 로컬 스트림
    faceMeshStream: null, // FaceMesh 적용된 스트림
  },
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
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
      state.localStream = null;
      state.faceMeshStream = null;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setFaceMeshStream: (state, action) => {
      state.faceMeshStream = action.payload;
    },
    setMaxNo: (state, action) => {
      state.maxNo = action.payload; // 최대 인원수 설정
    },
  },
});

export const {
  setRoomId,
  setSession,
  setPublisher,
  addSubscriber,
  clearSession,
  setLocalStream,
  setFaceMeshStream,
  setMaxNo,
} = roomSlice.actions;

export default roomSlice.reducer;
