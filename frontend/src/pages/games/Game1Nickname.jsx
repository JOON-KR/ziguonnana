import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import Nana from "../../assets/icons/nana.png";
import { useSelector, useDispatch } from "react-redux";
import { setNicknameList } from "../../store/nicknameSlice";
import { useNavigate } from "react-router-dom";

// 스타일드 컴포넌트 정의
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;  /* 요소를 세로로 중앙 정렬 */
  align-items: center;  /* 요소를 가로로 중앙 정렬 */
  width: 100%;
  height: 100vh;  /* 뷰포트 높이에 맞추기 */
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const BubbleWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
  flex-wrap: wrap;
`;

const StyleButton = styled.button`
  padding: 16px 32px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #58FFF5;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #ff6347;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #ff4500;
    transform: translateY(0);
  }
`;

const NanaImg = styled.img`
  width: 300px;
  height: auto;
  margin-top: -50px; /* 상단 마진 조정 */
  margin-bottom: 20px;
`;

const SelectedStyleText = styled.div`
  margin-top: 20px;
  padding: 20px 40px;
  font-size: 24px; /* 폰트 크기 조정 */
  font-weight: bold;
  color: white;
  background-color: #ff6347;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05); /* hover 효과로 크기 증가 */
  }
`;

const Game1Nickname = () => {
  const navigate = useNavigate();
  const styles = ["중세", "조선", "동물", "미래"];
  const text = "별명 스타일을 선택하세요";

  // Redux 상태에서 필요한 값들 가져오기
  const userNo = useSelector((state) => state.auth.userNo); // 현재 사용자의 userNo
  const roomId = useSelector((state) => state.room.roomId); // 현재 방의 roomId
  const stompClient = useSelector((state) => state.client.stompClient); // WebSocket 클라이언트
  const dispatch = useDispatch();

  const [selectedStyle, setSelectedStyle] = useState(""); // 선택한 스타일 상태

  // 별명 스타일 선택 시 호출되는 함수
  const handleStyleClick = (style) => {
    setSelectedStyle(style); // 선택한 스타일 상태 업데이트
    if (stompClient && stompClient.connected) {
      const message = { style, num: userNo };
      console.log("Sending message to server:", message); // 서버로 보내는 메시지 로그
      // 선택한 스타일과 사용자 번호를 포함한 메시지를 서버로 전송
      stompClient.send(
        `/app/game/${roomId}/nickname`,
        {},
        JSON.stringify(message)
      );
    } else {
      console.error("Stomp client is not connected");
    }
  };

  // 컴포넌트가 마운트되었을 때 실행
  useEffect(() => {
    if (stompClient && stompClient.connected) {
      console.log("Subscribing to topic:", `/topic/game/${roomId}`);
      // 방의 메시지를 구독
      const subscription = stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
        const response = JSON.parse(message.body);
        console.log("Received message from server:", response); // 서버로부터 받은 메시지 로그
        if (response.message.trim() === "별명 전파") {
          // 별명 리스트를 받아와서 Redux 상태 업데이트
          dispatch(setNicknameList(response.data));
          // 별명 리스트를 받고 나면 아바타 명함 제작 대기화면으로 이동
          setTimeout(() => {
            navigate('/icebreaking/games/game1Result');
          }, 3000); // 3초 후에 이동
        }
      });

      // 컴포넌트 언마운트 시 구독 취소
      return () => {
        console.log("Unsubscribing from topic:", `/topic/game/${roomId}`);
        subscription.unsubscribe();
      };
    } else {
      console.error("Stomp client is not connected in useEffect");
    }
  }, [stompClient, dispatch, roomId, navigate]);

  return (
    <Wrap>
      <BubbleWrap>
        <SpeechBubble text={text} />
      </BubbleWrap>
      <NanaImg src={Nana} />
      <ButtonWrap>
        {styles.map((style) => (
          <StyleButton key={style} onClick={() => handleStyleClick(style)}>
            {style}
          </StyleButton>
        ))}
      </ButtonWrap>
      {selectedStyle && (
        <SelectedStyleText>{`${selectedStyle} 스타일을 선택하셨습니다`}</SelectedStyleText>
      )}
    </Wrap>
  );
};

export default Game1Nickname;
