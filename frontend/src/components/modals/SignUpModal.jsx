import React, { useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";

// 소셜 회원가입 아이콘
import GoogleIcon from "../../assets/icons/google.png";
import KakaoIcon from "../../assets/icons/kakao.png";

// 공통으로 사용되는 스타일 컴포넌트를 정의
const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 배경을 어둡게 만드는 스타일 컴포넌트
const BlackBg = styled(FlexCenter)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
`;

// 모달의 스타일을 정의하는 컴포넌트
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

// 모달 제목의 스타일을 정의하는 컴포넌트
const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 48px;
  color: #54595e;
`;

// 입력 필드들을 감싸는 래퍼의 스타일을 정의하는 컴포넌트
const InputWrapper = styled.div`
  width: 100%;
  max-width: 465px;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

// 라벨과 입력 필드를 감싸는 래퍼의 스타일을 정의하는 컴포넌트
const LabelInputWrapper = styled(FlexCenter)`
  align-items: center;
  margin: 10px 0; /* 입력 필드 사이 간격을 상하 10px로 설정 */
  width: 100%;
`;

// 라벨의 스타일을 정의하는 컴포넌트
const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #54595e;
  width: 120px; /* width를 넉넉히 설정하여 한 줄에 나오게 함 */
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

// 입력 필드의 스타일을 정의하는 컴포넌트
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

// 버튼을 감싸는 래퍼의 스타일을 정의하는 컴포넌트
const BtnWrap = styled(FlexCenter)`
  margin-top: 20px;
  width: 100%;
`;

// 에러 메시지의 스타일을 정의하는 컴포넌트
const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 5px 0; /* 이메일 형식 에러 메시지에 마진 추가 */
`;

// 소셜 회원가입 섹션의 스타일을 정의하는 컴포넌트
const SocialLoginSection = styled(FlexCenter)`
  margin-top: 24px;
  width: 351px;
  height: 63px;
  border: 3px solid #54595e;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
`;

// 소셜 회원가입 텍스트의 스타일을 정의하는 컴포넌트
const SocialLoginText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #54595e;
`;

// 소셜 회원가입 버튼의 스타일을 정의하는 컴포넌트
const SocialLoginButton = styled.img`
  width: 48px;
  height: 48px;
  cursor: pointer;
`;

// 회원가입 모달 컴포넌트
const SignUpModal = ({ onClose, AquaBtnFn, onGoogleLogin, onKakaoLogin }) => {
  // 상태 변수 선언
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [error, setError] = useState(""); // 에러 메시지 상태

  // 이메일 형식을 검증하는 함수
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // 이메일 입력 변경 처리 함수
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setError("이메일 형식이 아닙니다.");
    } else {
      setError("");
    }
  };

  // 회원가입 버튼 클릭 처리 함수
  const handleSignUp = () => {
    if (!validateEmail(email)) {
      setError("이메일 형식이 아닙니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    AquaBtnFn();
  };

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
            <InputField
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={handleEmailChange}
            />
          </LabelInputWrapper>
          {!validateEmail(email) && email && (
            <ErrorMessage>이메일 형식이 아닙니다.</ErrorMessage>
          )}
          <LabelInputWrapper>
            <Label>비밀번호</Label>
            <InputField
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>비밀번호 확인</Label>
            <InputField
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </LabelInputWrapper>
          {error && error !== "이메일 형식이 아닙니다." && (
            <ErrorMessage>{error}</ErrorMessage>
          )}
        </InputWrapper>
        <BtnWrap>
          <AquaBtn text="회원가입" BtnFn={handleSignUp} />
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
