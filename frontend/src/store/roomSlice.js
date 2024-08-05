import { createSlice } from "@reduxjs/toolkit";

//리덕스 툴킷(RTK)에서는 상태 하나를 slice라고 부름
export const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomId: "",
    teamCode: "",
    maxNo: 0,
  },

  //state 수정 함수들, 리턴값으로 상태 변수 설정
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setTeamCode: (state, action) => {
      state.teamCode = action.payload;
    },
    setMaxNo: (state, action) => {
      state.maxNo = action.payload;
    },
  },
});

export const { setRoomId, setTeamCode, setMaxNo } = roomSlice.actions;

export default roomSlice;
