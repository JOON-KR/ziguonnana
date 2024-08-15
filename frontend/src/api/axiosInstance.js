// axiosInstance.js
import axios from "axios";
import BASE_URL from "./APIconfig";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 토큰 가져오기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // 토큰이 있으면 헤더에 토큰 추가
    } else {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 오류 세부 사항 로그
    console.error(
      "응답 오류:",
      error.response ? error.response.data : "서버와의 연결 오류"
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
