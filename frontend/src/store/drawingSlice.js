import { createSlice } from "@reduxjs/toolkit";

export const drawingSlice = createSlice({
  name: "drawing",
  initialState: {
    drawingData: {}
  },
  reducers: {
    setDrawingData: (state, action) => {
      state.drawingData = action.payload;
    },
  },
});

export const { setDrawingData } = drawingSlice.actions;
export default drawingSlice;

// "message": "그림 전파",
// "data": {
//   "1": {
//     "num": 1,
//     "keyword": "예시 키워드1",
//     "art": [10, 20, 30, 40]  // Byte 배열의 예시
//   },
//   "2": {
//     "num": 2,
//     "keyword": "예시 키워드2",
//     "art": [50, 60, 70, 80]  // Byte 배열의 예시
//   },
//   "3": {
//     "num": 3,
//     "keyword": "예시 키워드3",
//     "art": [90, 100, 110, 120]  // Byte 배열의 예시
//   }
// }