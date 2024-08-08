import { createSlice } from "@reduxjs/toolkit";

export const drawingSlice = createSlice({
  name: "drawing",
  initialState: {
    drawingData: {
      num: 0,
      keyword: "",
      art: [], // Byte 배열의 예시
    },
  },
  reducers: {
    setDrawingData: (state, action) => {
      state.drawingData = action.payload;
    },
  },
});

export const { setDrawingData } = drawingSlice.actions;
export default drawingSlice;
