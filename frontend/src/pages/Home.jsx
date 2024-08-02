import React, { useEffect, useState } from "react";
import styled from "styled-components";
import main_bg from "../assets/images/우주배경.jpg";
import main_icon from "../assets/icons/지구픽셀.png";
import LoginModal from "../components/modals/LoginModal";
import SignUpModal from "../components/modals/SignUpModal";
import RoomCreateModal from "../components/modals/RoomCreateModal";
import RoomJoinModal from "../components/modals/RoomJoinModal";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../api/login/loginAPI";
import { signup } from "../api/signup/signupAPI"; // 회원가입 API 함수 import

// Home 페이지 전체를 감싸는 스타일 컴포넌트
const HomeWrap = styled.div`
  background-image: url(${main_bg});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

// 상단 헤더 스타일 컴포넌트
const Header = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  justify-content: flex-end;
  padding: 20px;
  z-index: 2;
`;

// 헤더 텍스트 스타일 컴포넌트
const HeaderText = styled.h4`
  font-size: 28px;
  padding: 0 23px;
  color: white;
  cursor: pointer;
`;

// 버튼 랩퍼 스타일 컴포넌트
const BtnWrap = styled.div`
  display: flex;
  gap: 51px;
  z-index: 2;
`;

// 기본 버튼 스타일 컴포넌트
const Btn = styled.button`
  background-color: #58fff5;
  font-size: 18px;
  color: black;
  width: 200px;
  height: 68px;
  border-radius: 34px;
  border: none;
  cursor: pointer;
`;

// 검정 버튼 스타일 컴포넌트 (Btn 상속)
const BlackBtn = styled(Btn)`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 2px solid white;
`;

// 중앙 랩퍼 스타일 컴포넌트
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
`;

// 타이틀 스타일 컴포넌트
const Title = styled.h1`
  font-size: 128px;
  font-weight: 600;
  color: white;
  margin: 76px 0px;
  z-index: 2;
`;

// 서브 타이틀 스타일 컴포넌트
const SubTitle = styled.h3`
  font-size: 28px;
  color: white;
  z-index: 2;
`;

// 지구 아이콘 스타일 컴포넌트
const EarthIcon = styled.img`
  width: 800px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isRoomCreateModalOpen, setIsRoomCreateModalOpen] = useState(false);
  const [isRoomJoinModalOpen, setIsRoomJoinModalOpen] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
    } catch (e) {
      setError("로그인 실패: " + e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
    } catch (e) {
      setError("로그아웃 실패: " + e.message);
    }
  };

  const handleSignUp = async ({ email, name, password }) => {
    try {
      await signup({ email, name, password });
      setIsLoggedIn(true);
      setIsSignUpModalOpen(false);
    } catch (e) {
      setError("회원가입 실패: " + e.message);
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const closeRoomCreateModal = () => {
    setIsRoomCreateModalOpen(false);
  };

  const closeRoomJoinModal = () => {
    setIsRoomJoinModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <HomeWrap>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {isLoginModalOpen && (
        <LoginModal onClose={closeLoginModal} AquaBtnFn={handleLogin} />
      )}
      {isSignUpModalOpen && (
        <SignUpModal onClose={closeSignUpModal} AquaBtnFn={handleSignUp} />
      )}
      {isRoomCreateModalOpen && (
        <RoomCreateModal onClose={closeRoomCreateModal} />
      )}
      {isRoomJoinModalOpen && <RoomJoinModal onClose={closeRoomJoinModal} />}
      <Header>
        <HeaderText
          onClick={() => {
            if (isLoggedIn) {
              handleLogout();
            } else {
              setIsLoginModalOpen(true);
            }
          }}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </HeaderText>
        {isLoggedIn ? (
          <HeaderText onClick={() => navigate("/MyPage")}>
            마이페이지
          </HeaderText>
        ) : (
          <HeaderText onClick={() => setIsSignUpModalOpen(true)}>
            회원가입
          </HeaderText>
        )}
        <HeaderText
          onClick={() => {
            navigate("/user/community");
          }}
          style={{ marginRight: "12px" }}
        >
          커뮤니티
        </HeaderText>
      </Header>
      <Wrap>
        <SubTitle>마음속의 얼음을 부수다</SubTitle>
        <Title>지구 ON 나나</Title>
        <BtnWrap>
          <BlackBtn onClick={() => setIsRoomCreateModalOpen(true)}>
            생성하기
          </BlackBtn>
          <Btn onClick={() => setIsRoomJoinModalOpen(true)}>참가하기</Btn>
        </BtnWrap>
      </Wrap>
      <EarthIcon src={main_icon} alt="지구 아이콘" />
    </HomeWrap>
  );
};

export default Home;
