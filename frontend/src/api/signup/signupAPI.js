import axios from "axios";
import BASE_URL from "../APIconfig";

const accessToken = localStorage.getItem("accessToken");

// 회원가입
export const signup = async ({ email, name, password }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/member/signup`, // 여기서 슬래시가 중복되지 않도록 수정합니다.
      { email, name, password },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("회원가입 성공:", response);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};
