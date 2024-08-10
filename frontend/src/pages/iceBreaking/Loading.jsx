import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionList } from "../../store/questionSlice";

const PageWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 16px;
  box-sizing: border-box;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const [messages, setMessages] = useState([]);
  const questionList = useSelector((state) => state.question.questionList);
  const dispatch = useDispatch();
  const { profileData } = location.state || {};

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client ? client.connected : "클라이언트 없음");
    console.log("--------------------------------");

    if (client && client.connected) {
      // 클라이언트가 연결된 경우에만 구독 및 메시지 전송
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log("방에서 받은 메시지:", parsedMessage);
          if (
            parsedMessage.data === true &&
            parsedMessage.commandType === "GAME_START"
          ) {
            navigate("/icebreaking/intro");
          } else if (parsedMessage.message === "질문리스트 전파\n") {
            dispatch(setQuestionList(parsedMessage.data.question));
            console.log(parsedMessage.data.question);
          }
        }
      );

      client.send(`/app/game/${roomId}/self-introduction/question`, {}, {});

      console.log("소켓에 전송할 데이터 : ", profileData);
      client.send(
        `/app/game/${roomId}/profile`,
        {},
        JSON.stringify(profileData)
      );

      // 컴포넌트가 언마운트되거나 roomId가 변경될 때 구독을 취소
      return () => {
        subscription.unsubscribe();
        console.log("구독 취소됨.");
      };
    } else {
      console.warn(
        "STOMP 클라이언트가 연결되지 않았습니다. 구독과 전송을 시도할 수 없습니다."
      );
      // 연결되지 않았을 때의 처리: 재연결 시도 로직 추가 가능
    }
  }, [client, roomId, profileData, navigate, dispatch]);

  const handleNavigateToGame4 = () => {
    navigate("/icebreaking/games/game3");
  };

  return (
    <PageWrap>
      <Content>
        <Loader />
        <Button onClick={handleNavigateToGame4}>Go to Game 4</Button>
      </Content>
    </PageWrap>
  );
};

export default Loading;
