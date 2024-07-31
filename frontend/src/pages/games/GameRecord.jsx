import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import cardPic from "../../assets/images/profileCard.png";
import leftIcon from "../../assets/icons/left.png";
import rightIcon from "../../assets/icons/right.png";
import recordIcon from "../../assets/icons/record.png";
import recordBtn from "../../assets/icons/aqua_btn.png";
import gameRecordIcon from "../../assets/icons/game_record.png";

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
  margin-bottom: 30px;
  color: white;
`;

const RecordSection = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
`;

const GameSection = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 10px;
  color: white;
`;

const Slide = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const RecordTitle = styled.h2`
  font-size: 28px;
  margin: 10px;
`;

const CardImage = styled.img`
  height: 150px;
  margin: 0 20px;
`;

const IconImage = styled.img`
  height: 50px;
  margin: 10px;
`;

const RecordIconImage = styled.img`
  height: 36px;
  margin: 20px;
`;

const GameRecordIconImage = styled.img`
  height: 36px;
  margin: 5px;
`;

const Text = styled.p`
  font-size: 20px;
  flex: 1;
  text-align: left;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
`;

const ButtonText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  pointer-events: none; // 버튼 텍스트가 클릭되지 않도록 설정
  margin-bottom: 10px;
`;

const GameRecord = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

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

        <RecordSection>
          <RecordIconImage src={recordIcon} alt="gameRecord" />
          <RecordTitle>게임 기록</RecordTitle>
          <GameSection>
            <Slide>
              <GameRecordIconImage src={leftIcon} alt="Left" />
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              <GameRecordIconImage src={rightIcon} alt="Right" />
            </Slide>
            {/* 게임 이름 & 인원 */}
            <Text>몸으로 말해요  6/6</Text>
          </GameSection>
          <ButtonContainer onClick={() => handleButtonClick('/games/gameRecordDetail')}>
            <ButtonText>게임상세</ButtonText>
            <IconImage src={recordBtn} alt="gameRecordBtn" />
          </ButtonContainer>
        </RecordSection>
        
        <RecordSection>
          <RecordIconImage src={recordIcon} alt="gameRecord" />
          <RecordTitle>숏폼 기록</RecordTitle>
          <GameSection>
            <Text>숏폼 기록 내용</Text>
          </GameSection>
          <ButtonContainer onClick={() => handleButtonClick('/user/community')}>
            <ButtonText>커뮤니티</ButtonText>
            <IconImage src={recordBtn} alt="gameRecordBtn" />
          </ButtonContainer>
        </RecordSection>
      </BodyContainer>
    </PageWrap>
  );
};

export default GameRecord;
