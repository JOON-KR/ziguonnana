import { jwtDecode } from "jwt-decode";

const accessToken = localStorage.getItem("AccessToken");

//jwt 복호화 -> 데이터 추출 가능한 상태로 만듦
export const decodeToken = () => {
  try {
    if (accessToken != null) {
      return jwtDecode(accessToken);
    }
  } catch (error) {
    console.log("");
  }
};

//엑세스 토큰 만료됐는지 확인
export const isAccessTokenExpired = () => {
  const decodedToken = decodeToken(accessToken);
  if (!decodedToken) {
    return true;
  }

  const currentTime = Date.now() / 1000;
  return decodeToken.exp < currentTime;
};
