import React, { useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn"; // 이미 존재하는 GrayBtn 컴포넌트를 불러옴
import ProfileNana from "../../assets/icons/ProfileNana.png"; // 기본 프로필 이미지
import axios from "axios";
import BASE_URL from "../../api/APIconfig";

const BlackBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalWrap = styled.div`
  background-image: url(${GoogleModal});
  background-size: cover;
  background-position: center;
  width: 721px;
  height: 610px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #54595e;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImageWrapper = styled.div`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  margin-right: 20px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageInput = styled.input`
  display: none;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #54595e;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  width: 250px;
  height: 48px;
  padding: 0 10px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #54595e;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  ::placeholder {
    color: #acacac; /* placeholder 글씨 색상 설정 */
  }
`;

const HashTagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LabelInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 입력 필드 사이 간격을 10px로 설정 */
`;

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px; /* 버튼 사이 간격 설정 */
`;

const ProfileRegisterModal = ({ onClose, onRegisterProfile }) => {
  const [profileImage, setProfileImage] = useState(ProfileNana);
  const [name, setName] = useState(""); // 이름 입력 필드 추가
  const [hashTag1, setHashTag1] = useState("");
  const [hashTag2, setHashTag2] = useState("");
  const [hashTag3, setHashTag3] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRegister = async () => {
    const hashTags = [hashTag1, hashTag2, hashTag3].filter(
      (tag) => tag.trim() !== ""
    );
    if (hashTags.length > 3) {
      alert("해시태그는 최대 3개까지 입력할 수 있습니다.");
      return;
    }
    const profileData = { profileImage, name, feature: hashTags.join(", ") };

    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("feature", hashTags.join(", "));
        formData.append("profileImg", profileImage);
        const response = await axios.post(`${BASE_URL}/api/v1/profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("프로필 등록 성공:", response);
        onRegisterProfile(response.data);
      } catch (error) {
        console.error("프로필 등록 실패:", error);
      }
    } else {
      onRegisterProfile(profileData);
    }
  };

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Title>프로필에 등록할 정보를 입력하세요.</Title>
        <ProfileWrapper>
          <ProfileImageWrapper
            onClick={() => document.getElementById("imageInput").click()}
          >
            <ProfileImage src={profileImage} alt="Profile" />
            <ImageInput
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </ProfileImageWrapper>
          <NameWrapper>
            <Label>이름</Label>
            <InputField
              type="text"
              placeholder="이름을 입력해주세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </NameWrapper>
        </ProfileWrapper>
        <HashTagWrapper>
          <LabelInputWrapper>
            <Label>해시태그1</Label>
            <InputField
              type="text"
              placeholder="첫번째 해시태그를 입력해주세요."
              value={hashTag1}
              onChange={(e) => setHashTag1(e.target.value)}
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>해시태그2</Label>
            <InputField
              type="text"
              placeholder="두번째 해시태그를 입력해주세요."
              value={hashTag2}
              onChange={(e) => setHashTag2(e.target.value)}
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>해시태그3</Label>
            <InputField
              type="text"
              placeholder="세번째 해시태그를 입력해주세요."
              value={hashTag3}
              onChange={(e) => setHashTag3(e.target.value)}
            />
          </LabelInputWrapper>
        </HashTagWrapper>
        <BtnWrap>
          <GrayBtn text="취소" BtnFn={onClose} />
          <AquaBtn text="프로필 등록" BtnFn={handleRegister} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default ProfileRegisterModal;
