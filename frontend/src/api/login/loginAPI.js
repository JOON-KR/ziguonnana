import axiosInstance from "../axiosInstance";

// 로그인시 로컬 스토리지에 토큰 저장
export const login = async (email, password) => {
  const sendingData = { email, password };
  try {
    const res = await axiosInstance.post('/api/v1/member/login', sendingData);
    const token = res.data.data.accessToken; // 응답에서 accessToken 추출
    localStorage.setItem('token', token);
    return res.data;
  } catch (e) {
    console.log("로그인 오류입니다.", e);
    throw e;
  }
}

// 로그아웃시 로컬 스토리지에서 토큰 삭제
export const logout = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    await axiosInstance.post('/api/v1/member/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (e) {
    console.log("로그아웃 오류입니다.", e);
    throw e;
  } finally {
    localStorage.removeItem('token');
  }
};
