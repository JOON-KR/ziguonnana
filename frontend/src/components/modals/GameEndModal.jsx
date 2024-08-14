import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ClearModal from "../../assets/images/clearModal.png";
import AquaBtn from "../../assets/icons/aqua_btn.png";
import EndBg from "../../assets/images/endBg.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// 공통 스타일
const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlackBg = styled(FlexCenter)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
  background-image: url(${EndBg});
  background-size: cover; 
  background-position: center; 
`;

const ModalWrap = styled(FlexCenter)`
  background-image: url(${ClearModal});
  background-size: contain; /* 이미지를 줄이면서 비율 유지 */
  background-position: center;
  width: 100%; 
  height: 100%; 
  max-width: 600px;
  max-height: 600px;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: bold;
  margin-top: 130px;
  margin-bottom: 30px;
  color: black;
  text-align: center;
`;

const BtnWrap = styled(FlexCenter)`
  margin-top: 20px;
  margin-right: 20px;
  width: 100%;
  display: flex;
  gap: 10px;
  text-align: center;
`;

// AquaBtn 스타일 정의
const StyledButton = styled.button`
  background: url(${AquaBtn}) no-repeat center center;
  background-size: contain;
  width: 150px;
  height: 80px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #54595E;
  text-align: center;
  font-weight: bold;
`;

const GameEndModal = ({ onClose }) => {
  const roomId = useSelector((state) => state.room.roomId);
  const userNo = useSelector((state) => state.auth.userNo);
  const maxNo = useSelector((state) => state.room.maxNo);
  const [teamName, setTeamName] = useState(""); // 팀명
  const [bodyCount, setBodyCount] = useState(0); // 몸으로말해요 맞춘 개수
  const [bodyDuration, setBodyDuration] = useState(0); // 몸으로말해요 걸린시간(초)
  const [igudongseongCount, setIgudongseongCount] = useState(0); // 이구동성 맞춘 개수
  const [poseBestList, setPoseBestList] = useState("") // 포즈맞추기 제일 많이 맞춘 사람 이름, ..
  const [shortsURL, setShortsURL] = useState(null); // 숏폼 결과 url
  const [avatarCards, setAvatarCards] = useState([]); // 아바타명함(이미지, 특징, 닉네임)

  const client = useSelector((state) => state.client.stompClient);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subscribed, setSubscribed] = useState(false);

  // 구독 / 데이터 받아오기
  useEffect(() => {
    if (client && client.connected) {
      // 구독
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        try {  
          const response = JSON.parse(message.body);
          console.log("서버로부터 받은 메시지:", response);
          if (response.commandType === "GAME_RESULT" && response.message === "SUCCESS") {
            console.log("서버로부터 받은 데이터:", response.data);
            const data = response.data;
            setTeamName(data.teamName);
            setBodyCount(data.bodyCount);
            setBodyDuration(data.bodyDuration);
            setIgudongseongCount(data.igudongseongCount);
            setPoseBestList(data.poseBestList);
            setShortsURL(data.shortsURL);
            setAvatarCards(data.avatarCards);
            // 모든 클라이언트에서 응답을 처리한 후 결과 페이지로 이동
            navigate("/icebreaking/games/gameRecord", {
              state: {
                teamName: data.teamName,
                bodyCount: data.bodyCount,
                bodyDuration: data.bodyDuration,
                igudongseongCount: data.igudongseongCount,
                poseBestList: data.poseBestList,
                shortsURL: data.shortsURL,
                avatarCards: data.avatarCards,
              },
            });
          } 
        } catch (error) {
          console.error("메시지 처리 중 오류 발생:", error);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId, navigate]);

  const handleNext = () => {
    if (client && client.connected) {
      console.log("send:", `/app/game/${roomId}/result`);
      client.send(`/app/game/${roomId}/result`, {}, {});
    } else {
      console.warn("send 문제 발생");
    }
  };

  

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
        <Title>
          마음 속의 얼음을 모두 녹인 여러분, <br /> 축하드립니다.
        </Title>
        <BtnWrap>
          <StyledButton onClick={handleNext}>결과 페이지</StyledButton>
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default GameEndModal;