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
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");

    client.subscribe(`/topic/game/${roomId}`, (message) => {
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
    });

    client.send(`/app/game/${roomId}/self-introduction/question`, {}, {});

    if (client && client.connected) {
      console.log("소켓에 전송할 데이터 : ", profileData);
      client.send(
        `/app/game/${roomId}/profile`,
        {},
        JSON.stringify(profileData)
      );
    }
  }, [client, roomId, profileData, navigate, dispatch]);

  const handleNavigateToGame4 = () => {
    navigate("/icebreaking/games/game4");
  };

  return (
    <PageWrap>
      <Content>
        <Loader />
        <Button onClick={handleNavigateToGame4}>Game4로 이동</Button>
      </Content>
    </PageWrap>
  );
};

export default Loading;
