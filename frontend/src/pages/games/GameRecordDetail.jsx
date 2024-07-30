import React from "react";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import recordBtn from "../../assets/icons/aqua_btn.png";
import gameRcordIcon from "../../assets/icons/game_record.png";
import avartarIcon from "../../assets/icons/avartar.png";

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
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 80%;
  height: 80vh;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
`;

const RecordSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const RecordTitle = styled.h2`
  font-size: 28px;
  margin: 10px;
`;

const AvartarContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const AvartarIconImage = styled.img`
  height: 80px;
  margin: 5px;
`;

const RecordIconImage = styled.img`
  height: 36px;
  margin: 20px;
`;

const GameRecordContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const GameRecordItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const GameRecordText = styled.span`
  font-size: 18px;
  margin-left: 10px;
  display: flex;
  align-items: center;
`;

const GameRecordDetail = () => {
  return (
    <PageWrap>
      <Header>오늘의 게임 기록</Header>
      <BodyContainer>
        <Section>
          <Title>우리 팀의 아바타</Title>
          <AvartarContainer>
            <AvartarIconImage src={avartarIcon} alt="avartar" />
            <AvartarIconImage src={avartarIcon} alt="avartar" />
            <AvartarIconImage src={avartarIcon} alt="avartar" />
            <AvartarIconImage src={avartarIcon} alt="avartar" />
            <AvartarIconImage src={avartarIcon} alt="avartar" />
            <AvartarIconImage src={avartarIcon} alt="avartar" />
          </AvartarContainer>
        </Section>
        <RecordSection>
          <RecordTitle>게임 기록</RecordTitle>
          <GameRecordContainer>
            <GameRecordItem>
            <RecordIconImage src={gameRcordIcon} alt="gameRecord" />
            <GameRecordText>몸으로 말해요 6/6</GameRecordText>
            </GameRecordItem>
            <GameRecordItem>
              <RecordIconImage src={gameRcordIcon} alt="gameRecord" />
              <GameRecordText>이구동성 게임 4/6</GameRecordText>
            </GameRecordItem>
            <GameRecordItem>
              <RecordIconImage src={gameRcordIcon} alt="gameRecord" />
              <GameRecordText>포즈 따라하기 1등!</GameRecordText>
            </GameRecordItem>
          </GameRecordContainer>
        </RecordSection>
      </BodyContainer>
    </PageWrap>
  );
};

export default GameRecordDetail;
