import axios from "axios";
import BASE_URL from "../APIconfig";

const accessToken = localStorage.getItem("accessToken");

// 1. 프로필 등록
export const createProfile = async ({ name, feature, profileImg }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("feature", feature);
  formData.append("profileImg", profileImg);

  try {
    const response = await axios.post(`${BASE_URL}/api/v1/profile`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("프로필 등록 성공:", response);
    return response.data.data;
  } catch (error) {
    console.error("프로필 등록 실패:", error);
    throw error;
  }
};

// 2. 프로필 불러오기
export const getProfile = async (profileId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/profile/${profileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("프로필 불러오기 성공:", response);
    return response.data.data;
  } catch (error) {
    console.error("프로필 불러오기 실패:", error);
    throw error;
  }
};

// 3. 프로필 리스트업
export const getProfileList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("프로필 리스트 불러오기 성공:", response);
    return response.data.data;
  } catch (error) {
    console.error("프로필 리스트 불러오기 실패:", error);
    throw error;
  }
};

// 4. 프로필 삭제
export const deleteProfile = async (profileId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/profile/${profileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("프로필 삭제 성공:", response);
    return response.data.data;
  } catch (error) {
    console.error("프로필 삭제 실패:", error);
    throw error;
  }
};
