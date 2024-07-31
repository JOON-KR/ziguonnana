import React, { useState } from "react";
import styled from "styled-components";
import main_bg from "../assets/images/main_bg.png";
import LoginModal from "../components/modals/LoginModal"; // LoginModal import
import SignUpModal from "../components/modals/SignUpModal"; // SignUpModal import
import RoomCreateModal from "../components/modals/RoomCreateModal"; // RoomCreateModal import
import RoomJoinModal from "../components/modals/RoomJoinModal"; // RoomJoinModal import
import { useNavigate } from "react-router-dom";

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
`;

// 상단 헤더 스타일 컴포넌트
const Header = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  justify-content: flex-end;
  padding: 20px;
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
  position: fixed;
`;

// 타이틀 스타일 컴포넌트
const Title = styled.h1`
  font-size: 128px;
  font-weight: 600;
  color: white;
  margin: 76px 0px;
`;

// 서브 타이틀 스타일 컴포넌트
const SubTitle = styled.h3`
  font-size: 28px;
  color: white;
`;

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 열림 상태 관리
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false); // 회원가입 모달 열림 상태 관리
  const [isRoomCreateModalOpen, setIsRoomCreateModalOpen] = useState(false); // RoomCreateModal 열림 상태 관리
  const [isRoomJoinModalOpen, setIsRoomJoinModalOpen] = useState(false); // RoomJoinModal 열림 상태 관리

  const navigate = useNavigate();

  // 로그인 성공 시 호출되는 함수
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  // 회원가입 성공 시 호출되는 함수
  const handleSignUp = () => {
    setIsLoggedIn(true);
    setIsSignUpModalOpen(false);
  };

  // 로그인 모달 닫기 함수
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // 회원가입 모달 닫기 함수
  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  // RoomCreateModal 닫기 함수
  const closeRoomCreateModal = () => {
    setIsRoomCreateModalOpen(false);
  };

  // RoomJoinModal 닫기 함수
  const closeRoomJoinModal = () => {
    setIsRoomJoinModalOpen(false);
  };

  return (
    <HomeWrap>
      {/* 로그인 모달이 열려있을 때 LoginModal을 렌더링 */}
      {isLoginModalOpen && (
        <LoginModal onClose={closeLoginModal} AquaBtnFn={handleLogin} />
      )}
      {/* 회원가입 모달이 열려있을 때 SignUpModal을 렌더링 */}
      {isSignUpModalOpen && (
        <SignUpModal onClose={closeSignUpModal} AquaBtnFn={handleSignUp} />
      )}
      {/* RoomCreateModal이 열려있을 때 RoomCreateModal을 렌더링 */}
      {isRoomCreateModalOpen && (
        <RoomCreateModal onClose={closeRoomCreateModal} />
      )}
      {/* RoomJoinModal이 열려있을 때 RoomJoinModal을 렌더링 */}
      {isRoomJoinModalOpen && <RoomJoinModal onClose={closeRoomJoinModal} />}
      <Header>
        <HeaderText
          onClick={() => {
            if (isLoggedIn) {
              setIsLoggedIn(false); // 로그아웃 처리
            } else {
              setIsLoginModalOpen(true); // 로그인 모달 열기
            }
          }}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </HeaderText>
        {isLoggedIn ? (
          <HeaderText
            onClick={() => {
              navigate("/MyPage");
            }}
          >
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
    </HomeWrap>
  );
};

export default Home;
