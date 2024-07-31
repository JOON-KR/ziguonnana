import React from "react";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import avartarIcon from "../../assets/icons/avartar.png";
import gameRecordIcon from "../../assets/icons/game_record.png";
// import GrayBtn from "../../components/common/GrayBtn";
// import AquaBtn from "../../components/common/AquaBtn";

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
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 80vh;
`;

const AvartarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-right: 10px;
  width: 50%;
  color: white;
  height: 510px;
`;

const RecordSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  width: 50%;
  color: white;
  height: 510px;
`;

const GameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 10px;
  color: white;
  margin: 10px;
  width: 80%;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const AvartarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const AvartarIconImage = styled.img`
  height: 130px;
  margin: 5px;
`;

const IconImage = styled.img`
  height: 50px;
  margin: 10px;
`;

const GameRecordText = styled.span`
  font-size: 18px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top:30px;
`;

const AquaBtn = styled.button`
  background-color: #58fff5;
  font-size: 18px;
  font-weight: bold;
  color: #54595e;
  width: 80px;
  height: 36px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

const GrayBtn = styled.button`
  background-color: #d4d7d9;
  font-size: 16px;
  font-weight: bold;
  color: #54595e;
  width: 80px;
  height: 36px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

const avatars = [
  avartarIcon, avartarIcon, avartarIcon, 
  avartarIcon, avartarIcon, avartarIcon
];

const GameRecordDetail = () => {
  const click1 = () => {
    alert('sdf');
  };

  return (
    <PageWrap>
      <Header>오늘의 게임 기록</Header>
      <BodyContainer>
        <AvartarSection>
          <Title>우리 팀의 아바타</Title>
          <AvartarContainer>
            {avatars.map((src, index) => (
              <AvartarIconImage key={index} src={src} alt={`avatar-${index}`} />
            ))}
          </AvartarContainer>
        </AvartarSection>

        <RecordSection>
          <Title>게임 기록</Title>
            <GameSection>
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              <GameRecordText>몸으로 말해요 6/6</GameRecordText>
            </GameSection>

            <GameSection>
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              <GameRecordText>이구동성 게임 4/6</GameRecordText>
            </GameSection>

            <GameSection>
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              <GameRecordText>포즈 따라하기 1등!</GameRecordText>
            </GameSection>

            <ButtonContainer>
              <GrayBtn>돌아가기</GrayBtn>
              <AquaBtn>저장</AquaBtn>
            </ButtonContainer>
        </RecordSection>
      </BodyContainer>
    </PageWrap>
  );
};

export default GameRecordDetail;
