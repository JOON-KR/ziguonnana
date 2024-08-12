import React, { useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";

// 소셜 로그인 아이콘
import GoogleIcon from "../../assets/icons/google.png";
import KakaoIcon from "../../assets/icons/kakao.png";
import GreyBtn from "../common/GrayBtn";

// 공통 스타일
const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlackBg = styled(FlexCenter)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalWrap = styled(FlexCenter)`
  background-image: url(${GoogleModal});
  background-size: cover;
  background-position: center;
  width: 721px;
  height: 610px;
  flex-direction: column;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;
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
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LabelInputWrapper = styled(FlexCenter)`
  align-items: center;
  margin-bottom: 10px; /* 이메일과 비밀번호 사이 간격을 10px로 설정 */
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

const InputField = styled.input`
  width: 374px;
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

const FindPassword = styled.div`
  color: #ff8383;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
`;

const BtnWrap = styled(FlexCenter)`
  margin-top: 20px;
  width: 100%;
  display: flex;
  gap: 10px;
`;

// 소셜 로그인 섹션 스타일
const SocialLoginSection = styled(FlexCenter)`
  margin-top: 24px;
  width: 351px;
  height: 63px;
  border: 3px solid #54595e;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
`;

// 소셜 로그인 텍스트 스타일
const SocialLoginText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #54595e;
`;

// 소셜 로그인 버튼 스타일
const SocialLoginButton = styled.img`
  width: 48px;
  height: 48px;
  cursor: pointer;
`;

// 로그인 모달 컴포넌트
const LoginModal = ({
  onClose,
  onFindPasswordClick,
  AquaBtnFn,
  onGoogleLogin,
  onKakaoLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    AquaBtnFn(email, password);
  };

  //url 연결
  const handleKakaoLogin = () => {
    const kakaoLoginUrl = 'https://kauth.kakao.com/oauth/authorize?client_id=87083d235499273750821a7297a50305&redirect_uri=https://i11b303.p.ssafy.io/api/v1/member/login/kakao/callback&response_type=code';
    window.location.href = kakaoLoginUrl;
  };

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Title>로그인 정보를 입력하세요.</Title>
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
        <FindPassword onClick={onFindPasswordClick}>비밀번호 찾기</FindPassword>
        <BtnWrap>
          <AquaBtn text="로그인" BtnFn={handleSubmit} />
          <GreyBtn text="닫기" BtnFn={onClose} />
        </BtnWrap>
        <SocialLoginSection>
          <SocialLoginText>소셜 로그인</SocialLoginText>
          <div>
            <SocialLoginButton src={GoogleIcon} onClick={onGoogleLogin} />
            <SocialLoginButton src={KakaoIcon} onClick={handleKakaoLogin} />
          </div>
        </SocialLoginSection>
      </ModalWrap>
    </BlackBg>
  );
};

export default LoginModal;
