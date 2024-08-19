import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionList } from "../../store/questionSlice";
import { setNicknameList } from "../../store/nicknameSlice";

const PageWrap = styled.div`
  width: 100%;
  /* height: 100vh; Viewport height to fill the screen */
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
  flex-grow: 1; /* Allow Content to grow and take remaining space */
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
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
    if (!client || !client.connected) {
      console.error("STOMP 클라이언트가 연결되어 있지 않습니다.");
      return;
    }

    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");

    // 단일 구독 설정
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
        } else if (parsedMessage.commandType === "PROFILE_CREATE") {
          console.log("nicknameList: ", parsedMessage.data);
          dispatch(setNicknameList(parsedMessage.data));
        } else if (parsedMessage.message === "질문리스트 전파\n") {
          dispatch(setQuestionList(parsedMessage.data.question));
          console.log(parsedMessage.data.question);
        }
      }
    );

    // 메시지 전송
    console.log("소켓에 전송할 데이터 : ", profileData);
    client.send(`/app/game/${roomId}/profile`, {}, JSON.stringify(profileData));

    client.send(`/app/game/${roomId}/self-introduction/question`, {}, {});

    return () => {
      subscription.unsubscribe();
    };
  }, [client, roomId, navigate, profileData, dispatch]);

  return (
    <PageWrap>
      <Content>
        <Loader />
      </Content>
    </PageWrap>
  );
};

export default Loading;
