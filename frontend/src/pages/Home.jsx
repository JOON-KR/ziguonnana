import React, { useState } from "react";
import styled from "styled-components";
import main_bg from "../assets/images/main_bg.png";
import gray from "../assets/icons/gray.png";
import GameInfoModal from "../components/modals/GameInfoModal";
import { useNavigate } from "react-router-dom";

//스타일 컴포넌트
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

const Header = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  justify-content: flex-end;
  padding: 20px;
`;

const HeaderText = styled.h4`
  font-size: 28px;
  padding: 0 23px;
  color: white;
  cursor: pointer;
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 51px;
`;

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

const BlackBtn = styled(Btn)`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 2px solid white;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
`;

const Title = styled.h1`
  font-size: 128px;
  font-weight: 600;
  color: white;
  margin: 76px 0px;
`;

const SubTitle = styled.h3`
  font-size: 28px;
  color: white;
`;

//리액트 컴포넌트
const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const ButtonFn = () => {
    navigate("/games/game1");
  };

  return (
    <HomeWrap>
      {isModalOpen && (
        <GameInfoModal
          onClose={() => setIsModalOpen(false)}
          modalText={
            "포즈 따라하기 게임을 선택하셨습니다. 나나가 제시하는 사진을 따라하세요!"
          }
          planetImg={gray}
          RedBtnText={"게임 시작"}
          BlueBtnText={"게임 설명"}
          RedBtnFn={() => ButtonFn()}
          BlueBtnFn={() => ButtonFn()}
        />
      )}
      <Header>
        <HeaderText onClick={() => setIsModalOpen(true)}>모달모달</HeaderText>
        {isLoggedIn ? (
          <>
            <HeaderText
              onClick={() => {
                navigate("/MyPage");
              }}
            >
              마이페이지
            </HeaderText>
            <HeaderText
              onClick={() => {
                setIsLoggedIn(!isLoggedIn);
              }}
            >
              로그아웃
            </HeaderText>
          </>
        ) : (
          <HeaderText
            onClick={() => {
              setIsLoggedIn(!isLoggedIn);
            }}
          >
            로그인
          </HeaderText>
        )}
        <HeaderText>회원가입</HeaderText>
        <HeaderText style={{ marginRight: "12px" }}>커뮤니티</HeaderText>
      </Header>
      <Wrap>
        <SubTitle>마음속의 얼음을 부수다</SubTitle>
        <Title>지구 ON 나나</Title>
        <BtnWrap>
          <BlackBtn>생성하기</BlackBtn>
          <Btn>참가하기</Btn>
        </BtnWrap>
      </Wrap>
    </HomeWrap>
  );
};

export default Home;
