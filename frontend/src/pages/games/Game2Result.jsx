import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setGame2Finish } from "../../store/resultSlice";
import btnIcon from "../../assets/icons/aqua_btn.png";
import rocket from "../../assets/icons/rocket.png";
import nana from "../../assets/icons/nana.png";
import gold from "../../assets/icons/gold.png";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;  /* 가로 전체를 차지 */
  height: 100vh;  /* 뷰포트 높이에 맞추기 */
  position: relative;
`;

const ResultContainer = styled.div`
  background-color: rgba(104, 104, 104, 0.3);
  padding: 10px 60px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(86, 86, 86, 0.2);
  text-align: center;
  max-width: 700px;
  width: 100%;
  margin-bottom: 10px;
`;

const ResultText = styled.h1`
  font-size: 50px;  /* 텍스트 크기를 키움 */
  color: #58fff5;
  margin-bottom: 50px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const ResultDetail = styled.p`
  font-size: 24px;  /* 텍스트 크기를 키움 */
  color: #ffffff;
  margin: 15px 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 50px;
`;

const ButtonContainer = styled.div`
  position: relative;
  margin-top: 20px;
  margin-bottom: 30px;
  cursor: pointer;
  display: inline-block;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease-in-out;
  }
`;

const ButtonText = styled.p`
  position: absolute;
  top: 28%;
  left: 20%;
  color: #707070;
  font-size: 19px;
  font-weight: bold;
  pointer-events: none;
`;

const IconImage = styled.img`
  width: 160px;
`;

const GoldIcon = styled.img`
  position: relative;
  margin-bottom: 20px;
  width: 200px;
  height: auto;
`;


const Game2Result = () => {
  const location = useLocation();
  const { correctCnt, durationTime } = location.state;
  const client = useSelector((state) => state.client.stompClient);
  const roomId = useSelector((state) => state.room.roomId);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessages = JSON.parse(message.body);

          if (parsedMessages.commandType === "NANA_MAP") {
            dispatch(setGame2Finish());
            navigate("/icebreaking/games");
          }
        }
      );

      client.send(`/app/game/${roomId}/art-start`);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId, navigate, dispatch]);

  return (
    <Wrap>
      <ResultContainer>
        <GoldIcon src={gold} alt="gold"/>
        <ResultText>게임 결과</ResultText>
        <ResultDetail>맞춘 개수: <span style={{ color: "#efdf4a" }}>{correctCnt}</span>개</ResultDetail>
        <ResultDetail>소요된 시간:  <span style={{ color: "#ff532d" }}>{durationTime}</span>초</ResultDetail>
        <ButtonContainer
          onClick={() => {
            client.send(`/app/game/${roomId}/game-select`);
          }}
        >
          <ButtonText>게임 더보기</ButtonText>
          <IconImage src={btnIcon} alt="gamesBtn" />
        </ButtonContainer>
      </ResultContainer>
    </Wrap>
  );
};

export default Game2Result;
