import React from "react";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import avartarIcon from "../../assets/icons/avartar.png";
import gameRecordIcon from "../../assets/icons/game_record.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PageWrap = styled.div`
  background-image: url(${mypage_bg});
  background-size: cover;
  background-position: center;
  padding: 20px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width:100%;
  box-sizing: border-box;
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
  const navigate = useNavigate();
  const location = useLocation();
  const maxNo = useSelector((state) => state.room.maxNo);

  const { 
    teamName,  // 팀명
    bodyCount,  // 몸으로말해요 맞춘 개수
    bodyDuration,  // 몸으로말해요 걸린시간(초)
    igudongseongCount,  // 이구동성 맞춘 개수
    poseBestList,  // 포즈맞추기 제일 많이 맞춘 사람 이름, ..
    avatarCards,  // 아바타명함(이미지, 특징, 닉네임)
  } = location.state || {};

  const handleRecord = () => {
    navigate("/icebreaking/games/gameRecord");
  };

  return (
    <PageWrap>
      <Header>오늘의 게임 기록</Header>
      <BodyContainer>
        <AvartarSection>
          <Title>{teamName} 팀의 아바타</Title>
          <AvartarContainer>
            {avatarCards.map((avatarCard, index) => (
              <AvartarIconImage
                key={index} 
                src={avatarCard.avatarImage} 
                alt={`avatar-${index}`} 
              />
            ))}
          </AvartarContainer>
        </AvartarSection>

        <RecordSection>
          <Title>게임 기록</Title>
            <GameSection>
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              {/* 게임 이름 & 몸말맞춘수 & 게임 인원 */}
              <GameRecordText>몸으로 말해요 {bodyCount}/{maxNo}</GameRecordText>
            </GameSection>

            <GameSection>
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              {/* 게임 이름 & 몸말맞춘수 & 게임 인원 */}
              <GameRecordText>이구동성 게임 {igudongseongCount}/{maxNo}</GameRecordText>
            </GameSection>

            <GameSection>
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              <GameRecordText>
                <>
                  {/* 누가 1등인지 ?..?? */}
                  포즈 따라하기 1등!
                  {poseBestList}
                </>
              </GameRecordText>
            </GameSection>

            <ButtonContainer>
              <GrayBtn onClick={handleRecord}>돌아가기</GrayBtn>
              {/* 저장 함수 추가 */}
              <AquaBtn>저장</AquaBtn>
            </ButtonContainer>
        </RecordSection>
      </BodyContainer>
    </PageWrap>
  );
};

export default GameRecordDetail;
