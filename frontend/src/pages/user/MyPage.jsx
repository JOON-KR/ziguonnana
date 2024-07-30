import React, { useState } from "react";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import profilePic from "../../assets/images/profile.png";
import cardPic from "../../assets/images/profileCard.png";
import grayPic from "../../assets/icons/gray.png";
import orangePic from "../../assets/icons/orange.png";
import bluePic from "../../assets/icons/blue.png";
import { useNavigate } from "react-router-dom";

const PageWrap = styled.div`
  background-image: url(${mypage_bg});
  background-size: cover;
  background-position: center;
  padding: 20px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  font-size: 50px;
  color: #58fff5;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const BodyContainer = styled.div`
  display: flex;
  width: 80%;
  height: 80vh;
  gap: 20px;
`;

const LeftBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const Title = styled.h2`
  font-size: 30px;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const ProfileName = styled.h3`
  margin-bottom: 10px;
`;

const ProfileKeywords = styled.p`
  margin-bottom: 20px;
  font-style: italic;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ProfileButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
`;

const RightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TopBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 10px;
`;

const CardImage = styled.img`
  height: 150px;
  margin-bottom: 20px;
`;

const BottomBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 10px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
`;

const Icon = styled.img`
  width: 110px;
  height: 100px;
`;

const MyPage = () => {
  const [setIsLoggedIn] = useState(true); //로그인 상태
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleRecord = () => {
    navigate("/games/gameRecord");
  };

  return (
    <PageWrap>
      <Header>MYPAGE</Header>
      <BodyContainer>
        <LeftBox>
          <Title>내 프로필</Title>
          <ProfileImage src={profilePic} alt="프로필 사진" />
          <ProfileName>홍길동</ProfileName>
          <ProfileKeywords>#개발자, #음악 애호가, #여행자</ProfileKeywords>
          <ButtonContainer>
            <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
            <ProfileButton>내정보수정</ProfileButton>
          </ButtonContainer>
        </LeftBox>
        <RightBox>
          <TopBox>
            <Title>아바타 명함</Title>
            <CardImage src={cardPic} alt="아바타 명함" />
          </TopBox>
          <BottomBox>
            <Title>나의 기록</Title>
            <IconContainer>
              <Icon src={grayPic} alt="기록1" onClick={handleRecord} />
              <Icon src={orangePic} alt="기록2" />
              <Icon src={bluePic} alt="기록3" />
            </IconContainer>
          </BottomBox>
        </RightBox>
      </BodyContainer>
    </PageWrap>
  );
};

export default MyPage;
