//axios 인스턴스를 생성
//요청 시마다 로컬에서 토큰을 가져와 헤더에 추가하는 인터셉터 설정
import axios from "axios";
import BASE_URL from "./APIconfig";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
