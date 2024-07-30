import React from "react";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import cardPic from "../../assets/images/profileCard.png";
import leftIcon from "../../assets/icons/left.png";
import rightIcon from "../../assets/icons/right.png";

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
  color: #58FFF5;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 80vh;
`;

const Section = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 50px;
  color: white;
`;

const Slide = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 30px;
  margin-bottom: 20px;
`;

const CardImage = styled.img`
  height: 150px;
  margin: 0 20px;
`;

const IconImage = styled.img`
  height: 50px;
`;

const Text = styled.p`
  font-size: 20px;
`;

const GameRecord = () => {
  return (
    <PageWrap>
      <Header>RECORD</Header>
      <BodyContainer>
        <Section>
          <Title>아바타 명함</Title>
          <Slide>
            <IconImage src={leftIcon} alt="Left" />
            <CardImage src={cardPic} alt="아바타 명함" />
            <IconImage src={rightIcon} alt="Right" />
          </Slide>
        </Section>
        <Section>
          <Title>게임 기록</Title>
          <Text>게임 기록 내용</Text>
        </Section>
        <Section>
          <Title>숏폼 기록</Title>
          <Text>숏폼 기록 내용</Text>
        </Section>
      </BodyContainer>
    </PageWrap>
  );
};

export default GameRecord;
