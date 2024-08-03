import axios from "axios";
import BASE_URL from "../APIconfig";

const accessToken = localStorage.getItem("accessToken");

// 이미지 파일을 Base64로 인코딩하는 함수
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Base64 데이터만 추출
    reader.onerror = (error) => reject(error);
  });
};

// 1. 프로필 등록
export const createProfile = async ({ name, feature, profileImageFile }) => {
  const base64Image = profileImageFile ? await getBase64(profileImageFile) : null;

  const profileData = {
    name,
    feature: feature.split(', ').map(tag => tag.trim()), // 해시태그를 배열로 변환
    profileImage: base64Image,
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/v1/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
