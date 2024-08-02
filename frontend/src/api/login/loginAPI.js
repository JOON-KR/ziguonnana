import axiosInstance from "../axiosInstance";

// 로그인시 로컬 스토리지에 토큰 저장
export const login = async (email, password) => {
  const sendingData = { email, password };
  try {
    const res = await axiosInstance.post("/api/v1/member/login", sendingData);
    const accessToken = res.data.data.accessToken; // 답에서 accessToken 추출
    const refreshToken = res.data.data.refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return res.data;
  } catch (e) {
    console.log("로그인 오류입니다.", e);
    throw e;
  }
};

// 로그아웃시 로컬 스토리지에서 토큰 삭제
export const logout = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return;

  try {
    await axiosInstance.post("/api/v1/member/logout", {
      accessToken: accessToken,
    });
  } catch (e) {
    console.log("로그아웃 오류입니다.", e);
    throw e;
  } finally {
    localStorage.removeItem("accessToken");
  }
};
