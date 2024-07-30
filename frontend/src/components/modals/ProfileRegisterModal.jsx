import React, { useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn"; // 이미 존재하는 GrayBtn 컴포넌트를 불러옴
import ProfileNana from "../../assets/icons/ProfileNana.png"; // 기본 프로필 이미지

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

const InputWrapper = styled.div`
  width: 100%;
  max-width: 465px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LabelInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 입력 필드 사이 간격을 10px로 설정 */
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #54595e;
  width: 71px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImageWrapper = styled.div`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageInput = styled.input`
  display: none;
`;

const HashTagWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const HashTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const HashTag = styled.div`
  padding: 5px 10px;
  background-color: #58fff5;
  color: #54595e;
  border-radius: 5px;
  font-weight: bold;
`;

const InputField = styled.input`
  width: 250px;
  height: 48px;
  padding: 0 10px;
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

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px; /* 버튼 사이 간격 설정 */
`;

const ProfileRegisterModal = ({ onClose, onRegisterProfile }) => {
  const [profileImage, setProfileImage] = useState(ProfileNana);
  const [hashTags, setHashTags] = useState([]);
  const [hashTagInput, setHashTagInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleHashTagKeyPress = (e) => {
    if (e.key === "Enter" && hashTagInput.trim()) {
      setHashTags([...hashTags, hashTagInput.trim()]);
      setHashTagInput("");
      e.preventDefault();
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
        <HashTagWrapper>
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
          <LabelInputWrapper>
            <Label>해시태그</Label>
            <InputField
              type="text"
              placeholder="해시태그를 입력해주세요."
              value={hashTagInput}
              onChange={(e) => setHashTagInput(e.target.value)}
              onKeyPress={handleHashTagKeyPress}
            />
          </LabelInputWrapper>
        </HashTagWrapper>
        <HashTagsContainer>
          {hashTags.map((tag, index) => (
            <HashTag key={index}>{tag}</HashTag>
          ))}
        </HashTagsContainer>
        <InputWrapper>
          <LabelInputWrapper>
            <Label>이메일</Label>
            <InputField
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>비밀번호</Label>
            <InputField
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputWrapper>
        </InputWrapper>
        <BtnWrap>
          <GrayBtn text="취소" BtnFn={onClose} />
          <AquaBtn
            text="프로필 등록"
            BtnFn={() =>
              onRegisterProfile({ profileImage, hashTags, email, password })
            }
          />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default ProfileRegisterModal;
