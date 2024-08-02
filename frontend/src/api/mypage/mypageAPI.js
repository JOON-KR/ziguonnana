import axiosInstance from "../axiosInstance";

// 회원정보 수정
export const updateProfile = async (name, profileImage, feature) => {
  const updateData = {
    name,
    profileImage,
    feature,
  };

  try {
    const res = await axiosInstance.put("/api/v1/member", updateData);
    console.log("회원정보 수정 성공:", res.data);
    return res.data;
  } catch (e) {
    console.log("회원정보 수정 오류:", e);
    throw e;
  }
};

// 회원탈퇴
export const deleteUser = async (userId) => {
  try {
    const res = await axiosInstance.delete(`/api/v1/member`, {
      params: { userID: userId },
    });
    console.log("회원탈퇴 성공:", res.data);
    return res.data;
  } catch (e) {
    console.log("회원탈퇴 오류:", e);
    throw e;
  }
};

// 회원정보 조회
export const getUserInfo = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/member");
    console.log("회원정보 조회 성공:", res.data);
    return res.data;
  } catch (e) {
    console.log("회원정보 조회 오류:", e);
    throw e;
  }
};

// 게임 기록 조회
export const getGameRecords = async (userId) => {
  try {
    const res = await axiosInstance.get("/api/v1/records", {
      params: { userID: userId },
    });
    console.log("게임 기록 조회 성공:", res.data);
    return res.data;
  } catch (e) {
    console.log("게임 기록 조회 오류:", e);
    throw e;
  }
};
