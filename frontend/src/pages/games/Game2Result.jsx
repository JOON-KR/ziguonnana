import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setGame2Finish } from "../../store/resultSlice";
import btnIcon from "../../assets/icons/aqua_btn.png";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
  padding: 20px;
  color: #ffffff;
`;

const ResultContainer = styled.div`
  background-color: #282c34;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const ResultText = styled.h1`
  font-size: 28px;
  color: #58fff5;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const ResultDetail = styled.p`
  font-size: 20px;
  color: #ff6b6b;
  margin: 10px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
  position: relative;
  margin-top: 10px;
  cursor: pointer;
`;

const ButtonText = styled.p`
  position: absolute;
  top: 28%;
  left: 20%;
  color: white;
  font-size: 19px;
  font-weight: bold;
  pointer-events: none; /* 버튼 텍스트가 클릭되지 않도록 설정 */
`;

const IconImage = styled.img`
  width: 160px;
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
  }, [client, roomId]);

  return (
    <Wrap>
      <ResultContainer>
        <ResultText>게임 결과</ResultText>
        <ResultDetail>맞춘 개수: {correctCnt}</ResultDetail>
        <ResultDetail>소요된 시간: {durationTime}초</ResultDetail>
        <ButtonContainer
            onClick={() => {
              client.send(`/app/game/${roomId}/game-select`);
            }}
          >
            <ButtonText>
                게임 더보기
            </ButtonText>
            <IconImage src={btnIcon} alt="gamesBtn" />
          </ButtonContainer>
      </ResultContainer>
    </Wrap>
  );
};

export default Game2Result;
