import axios from "axios";
import BASE_URL from "../APIconfig";

// 답변을 서버에 제출하는 함수
export const submitAnswers = async ({ roomId, memberId, answers }) => {
  try {
    // POST 요청으로 답변을 서버에 전송
    const response = await axios.post(
      `${BASE_URL}/ws/app/game/${roomId}/self-introduction`, // 엔드포인트 URL
      {
        memberId: memberId, // 요청 바디에 memberId 포함
        answer: answers, // 요청 바디에 답변 배열 포함
      }
    );
    console.log("답변 전송 성공:", response.data); // 성공 시 응답 데이터 로그
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("답변 전송 실패:", error); // 오류 발생 시 오류 로그
    throw error; // 오류를 호출자에게 다시 던짐
  }
};