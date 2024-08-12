import React, { useState, useEffect, useRef } from "react";
import { resolvePath, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import cardPic from "../../assets/images/profileCard.png";
import leftIcon from "../../assets/icons/left.png";
import rightIcon from "../../assets/icons/right.png";
import recordIcon from "../../assets/icons/record.png";
import recordBtn from "../../assets/icons/aqua_btn.png";
import gameRecordIcon from "../../assets/icons/game_record.png";
import AvatarCard from "../../components/avatarCard/AvatarCard";
import axios from "axios";

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

const RecordHeader = styled.header`
  font-size: 50px;
  color: #58fff5;
  font-weight: bold;
  margin-top: 2px;
  margin-bottom: 20px;
`;

const SectionContainer1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // width: 80%;
  // height: 80vh;
`;

const SectionContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // width: 80%;
  // height: 80vh;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
  color: white;
`;

const AvatarCardSection = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 10px;
  margin-left: 60px;
  margin-bottom: 20px;
  // margin: 10px 10px 30px 10px;
  color: white;
`;

const RecordSection = styled.div`
  width: 100%;
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
  font-size: 24px;
  margin-bottom: 6px;
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
  margin: 15px;
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
  color: #58fff5;
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
  const roomId = useSelector((state) => state.room.roomId);
  const userNo = useSelector((state) => state.auth.userNo);
  const client = useSelector((state) => state.client.stompClient);
  const maxNo = useSelector((state) => state.room.maxNo);
  const [teamName, setTeamName] = useState(""); // 팀명
  const [bodyCount, setBodyCount] = useState(0); // 몸으로말해요 맞춘 개수
  const [bodyDuration, setBodyDuration] = useState(0); // 몸으로말해요 걸린시간(초)
  const [igudongseongCount, setIgudongseongCount] = useState(0); // 이구동성 맞춘 개수
  // const [poseBestList, ] // 포즈맞추기 제일 많이 맞춘 사람 이름, ..
  // const [shortsURL, setShortsURL] = useState(); // 숏폼 결과 url
  const [avartarCards, setAvatarCards] = useState([]); // 아바타명함(이미지, 특징, 닉네임)

  // ===========================================
  // socket-send
  useEffect(() => {
    if (client && client.connected) {
      console.log("send:", `/app/game/${roomId}/result`);
      client.send(`/app/game/${roomId}/result`, {}, {});
    } else {
      console.warn("send 문제 발생");
    }
  }, [client, roomId]);

  // 구독 / 데이터 받아오기
  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    console.log("유저 번호 :", userNo);

    if (client && client.connected) {
      // 구독
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        try {  
          const response = JSON.parse(message.body);
          console.log("서버로부터 받은 메시지:", response);
          if (response.commandType === "GAME_RESULT" && response.message === "SUCCESS") {
            console.log("서버로부터 받은 데이터:", response.data);
            // const recordData = response.data
            // 상태 저장
            setTeamName(response.data.teamName);
            console.log(response.data)
            setAvatarCards(response.data.avatarCards);
          } 
        } catch (error) {
          console.error("메시지 처리 중 오류 발생:", error);
        }
      });
      console.log(`구독 성공: /topic/game/${roomId}`);
      // 언마운트 시 구독 해제
      return () => {
        console.log("구독을 해제합니다.");
        subscription.unsubscribe();
      };
    } else {
      console.warn("클라이언트가 연결되지 않았거나 문제가 발생했습니다.");
    }
  }, [client, roomId, userNo]);
  

  // ===========================================

  const handleRecordDetail = () => {
    navigate("/icebreaking/games/gameRecordDetail");
  };
  const handleCommunity = () => {
    navigate("/user/community");
  };

  return (
    <PageWrap>
      <RecordHeader>RECORD</RecordHeader>
        <SectionContainer2>
          <SectionContainer1>
            <Section>
              <Title>팀명</Title>
              <Text>{teamName}</Text>
            </Section>
            <Section>
              <Title>인원수</Title>
              <Text>{maxNo}</Text>
            </Section>
          </SectionContainer1>
          <AvatarCardSection>
            <Title>아바타 명함</Title>
            {/* <Slide>
              {avartarCards.map((card, index) => (
                <AvatarCard
                  key={index}
                  avatarImage={card.avatarImage}
                  nickname={card.nickname}
                  features={card.features}
                />
              ))}
            </Slide> */}
            <Slide>
              <IconImage src={leftIcon} alt="Left" />
              <CardImage src={cardPic} alt="아바타 명함" />
              <IconImage src={rightIcon} alt="Right" />
            </Slide>
          </AvatarCardSection>
        </SectionContainer2>


        <RecordSection>
          <RecordIconImage src={recordIcon} alt="gameRecord" />
          <RecordTitle>게임기록</RecordTitle>
          <GameSection>
            <Slide>
              {/* <GameRecordIconImage src={leftIcon} alt="Left" /> */}
              <IconImage src={gameRecordIcon} alt="gameRecord" />
              {/* <GameRecordIconImage src={rightIcon} alt="Right" /> */}
            </Slide>
            {/* 게임 이름 & 인원 */}
            <Text>몸으로 말해요  6/6</Text>
          </GameSection>
          <ButtonContainer onClick={handleRecordDetail}>
            <ButtonText>게임상세</ButtonText>
            <IconImage src={recordBtn} alt="gameRecordBtn" />
          </ButtonContainer>
        </RecordSection>
        
        <RecordSection>
          <RecordIconImage src={recordIcon} alt="gameRecord" />
          <RecordTitle>숏폼기록</RecordTitle>
          <GameSection>
            <Title>숏폼 기록 내용</Title>
          </GameSection>
          <ButtonContainer onClick={handleCommunity}>
            <ButtonText>커뮤니티</ButtonText>
            <IconImage src={recordBtn} alt="gameRecordBtn" />
          </ButtonContainer>
        </RecordSection>
    </PageWrap>
  );
};
// 수정전
export default GameRecord;
