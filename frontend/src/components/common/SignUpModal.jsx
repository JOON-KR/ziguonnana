import React from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";

// 소셜 회원가입 아이콘
import GoogleIcon from "../../assets/icons/google.png";
import KakaoIcon from "../../assets/icons/kakao.png";

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
  margin-bottom: 48px;
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
  width: 120px; /* width를 넉넉히 설정하여 한 줄에 나오게 함 */
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px; /* label과 input 간격을 10px로 설정 */
`;

const InputField = styled.input`
  flex: 1;
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
`;

// 소셜 회원가입 섹션 스타일
const SocialLoginSection = styled.div`
  margin-top: 24px;
  width: 351px;
  height: 63px;
  border: 3px solid #54595e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
`;

// 소셜 회원가입 텍스트 스타일
const SocialLoginText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #54595e;
`;

// 소셜 회원가입 버튼 스타일
const SocialLoginButton = styled.img`
  width: 48px;
  height: 48px;
  cursor: pointer;
`;

const SignUpModal = ({ onClose, AquaBtnFn, onGoogleLogin, onKakaoLogin }) => {
  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Title>회원 정보를 입력하세요.</Title>
        <InputWrapper>
          <LabelInputWrapper>
            <Label>이메일</Label>
            <InputField type="email" placeholder="이메일을 입력해주세요." />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>비밀번호</Label>
            <InputField
              type="password"
              placeholder="비밀번호를 입력해주세요."
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>비밀번호 확인</Label>
            <InputField
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
            />
          </LabelInputWrapper>
        </InputWrapper>
        <BtnWrap>
          <AquaBtn text="회원가입" BtnFn={AquaBtnFn} />
        </BtnWrap>
        <SocialLoginSection>
          <SocialLoginText>소셜 회원가입</SocialLoginText>
          <div>
            <SocialLoginButton src={GoogleIcon} onClick={onGoogleLogin} />
            <SocialLoginButton src={KakaoIcon} onClick={onKakaoLogin} />
          </div>
        </SocialLoginSection>
      </ModalWrap>
    </BlackBg>
  );
};

export default SignUpModal;