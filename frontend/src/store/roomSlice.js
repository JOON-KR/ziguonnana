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
  },

  // 상태 수정 함수들
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setTeamCode: (state, action) => {
      state.teamCode = action.payload;
    },
  },
});

export const { setRoomId, setTeamCode } = roomSlice.actions;

export default roomSlice.reducer;
