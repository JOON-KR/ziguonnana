import axios from "axios";
import BASE_URL from "../Apiconfig";

// 로그인 함수 정의
const login = async (id, password) => {
  const sendingData = { id, password };

  try {
    const res = await axios.post(`${BASE_URL}api/login`, sendingData);
    const jwt = res.headers.authorization;

    if (jwt) {
      const ACCESS_TOKEN = "ACCESS_TOKEN";
      localStorage.setItem(ACCESS_TOKEN, jwt);
    }
  } catch (error) {
    alert("로그인 실패");
    console.log(error);
  }
};

export default login;
