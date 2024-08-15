import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import Nana from "../../assets/icons/nana.png";
import { useSelector, useDispatch } from "react-redux";
import { setNicknameList } from "../../store/nicknameSlice";
import { useNavigate } from "react-router-dom";
import homeIcon from "../../assets/icons/home.png"; 

// 스타일드 컴포넌트 정의
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vh;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  padding: 0;
`;

const MapButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #d8d8d8;
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #d8d8d8;
  border-radius: 34px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #00FFFF;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Header = styled.h1`
  font-size: 40px;
  color: white;
  text-align: center;
  font-weight: bold;
`;
const NanaImg = styled.img`
  width: 120px;
`;

const ButtonWrap = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 800px;
`;

const StyleCard = styled.div`
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 30px;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const StyleTitle = styled.h2`
  font-size: 24px;
  color: #ffffff;
  margin: 0;
`;

const StyleButton = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  background-color: #59e0d7;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #f76161;
  }

  &:active {
    background-color: #f76161;
  }
`;

const SelectedStyleText = styled.div`
  margin-top: 40px;
  padding: 20px 40px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: #f76161;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05); /* hover 효과로 크기 증가 */
  }
`;

const HomeIcon = styled.img`
  position: absolute;
  top:50px;
  left: 30px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;


const Game1Nickname = () => {
  const navigate = useNavigate();
  const styles = ["중세", "조선", "동물", "미래"];

  // Redux 상태에서 필요한 값들 가져오기
  const userNo = useSelector((state) => state.auth.userNo); // 현재 사용자의 userNo
  const roomId = useSelector((state) => state.room.roomId); // 현재 방의 roomId
  const stompClient = useSelector((state) => state.client.stompClient); // WebSocket 클라이언트
  const client = useSelector((state) => state.client.stompClient);
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

  //맵으로 이동
  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessages = JSON.parse(message.body);

          if (parsedMessages.commandType === "NANA_MAP") {
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

      <HomeIcon src={homeIcon} alt="Home" onClick={() => {
            client.send(`/app/game/${roomId}/game-select`);
          }}
        />
      <HeaderContainer>
        <Header>
          별명 스타일을 골라나나!
        </Header>
        <NanaImg src={Nana} />
      </HeaderContainer>
      
      <ButtonWrap>
        {styles.map((style) => (
          <StyleCard key={style} onClick={() => handleStyleClick(style)}>
            <StyleTitle>{style}</StyleTitle>
            <StyleButton>선택</StyleButton>
          </StyleCard>
        ))}
      </ButtonWrap>
      {selectedStyle && (
        <SelectedStyleText>{`${selectedStyle} 스타일을 선택했습니다`}</SelectedStyleText>
      )}
    </Wrap>

  );
};

export default Game1Nickname;
