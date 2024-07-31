import axios from "axios";
import BASE_URL from "../APIconfig";

const accesToken = localStorage.getItem("accessToken");

//영상 업로드
export const uploadVideo = async ({ name, video }) => {
  const data = {
    name,
    video,
  };
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/article/video`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("영상 업로드 : ", response);
    return response.data;
  } catch (error) {
    console.log("영상 업로드 에러", error);
  }
};

//영상 상세조회
export const getVideoDetail = async (videoId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/article/video/${videoId}`
    );
    console.log("영상 상세조회 : ", response);
    return response.data;
  } catch (error) {
    console.log("영상 상세조회 에러 : ", error);
  }
};

//영상 게시글 수정
export const modifyVideoArticle = async ({ code, message, data }) => {
  const data = {
    code,
    message,
    data,
  };
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/article/video/${videoId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("영상 게시글 수정 : ", response);
    return response.data;
  } catch (error) {
    console.log("영상 게시글 수정 에러 : ", error);
  }
};

//영상 게시글 삭제
export const deleteVideoArticle = async (videoId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/article/video/${videoId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("영상 게시글 삭제");
    return response.message;
  } catch (error) {
    console.log("영상 게시글 수정 에러 : ", error);
  }
};

//(커뮤) 아바타 업로드 - 이거 명세서 맞음??

//(커뮤) 아바타 게시글 상세조회
export const getAvatarArticleDetail = async (avatarId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/article/avatar/${avatarId}`,
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );
    console.log("아바타 게시글 상세조회 : ", response);
    return response.data;
  } catch (error) {
    console.log("아바타 게시글 상세조회 에러 : ", error);
  }
};

//(커뮤) 아바타 게시글 수정
export const modifyAvatarArticleDetail = async (avatarId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/article/avatar/${avatarId}`,
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );
    console.log("아바타 게시글 수정 : ", response);
    return response.data;
  } catch (error) {
    console.log("아바타 게시글 수정 에러 : ", error);
  }
};

//(커뮤) 아바타 게시글 삭제
export const deleteAvatarArticleDetail = async (avatarId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/article/avatar/${avatarId}`,
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );
    console.log("아바타 게시글 삭제 : ", response);
    return response.data;
  } catch (error) {
    console.log("아바타 게시글 삭제 에러 : ", error);
  }
};

//게시글 좋아요
export const likeArticle = async (avatarId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/article/avatar/like`,
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );
    console.log("아바타 게시글 삭제 : ", response);
    return response.data;
  } catch (error) {
    console.log("아바타 게시글 삭제 에러 : ", error);
  }
};

//커뮤니티 아바타리스트 조회

//
