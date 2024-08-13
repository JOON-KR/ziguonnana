import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import profileCardImage from "../../assets/images/profileCard.png";

// 스타일드 컴포넌트 정의
const ProfileCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; 
  width: 100%;
  height: auto;
`;

const ProfileCardBackground = styled.img`
  width: 100%;
  height: auto;
`;

const AvatarImage = styled.img`
  position: absolute;
  top: 50px; 
  left: 50%;
  transform: translateX(-50%);
  width: 300px; 
  height: auto;
  border-radius: 50%; 
  border: 5px solid white; 
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  font-size: 18px;
  color: #333;
`;

const FeatureItem = styled.li`
  margin-bottom: 10px;
`;

const Game1Avata = () => {
    const [avatarData, setAvatarData] = useState(null); // 아바타 데이터를 저장할 상태
    const roomId = useSelector((state) => state.room.roomId);
    const stompClient = useSelector((state) => state.client.stompClient);
    const userNo = useSelector((state) => state.auth.userNo);
  
    useEffect(() => {
      // stompClient가 연결되어 있고 roomId가 정의된 경우
      if (stompClient && stompClient.connected && roomId) {
        console.log("토픽 구독:", `/topic/game/${roomId}`);
        console.log("WebSocket 연결 상태:", stompClient.connected);
  
        // 서버로부터 메시지를 구독
        const subscription = stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
          console.log("서버로부터 받은 메시지:", message.body);
          try {
            // 메시지를 JSON 형식으로 파싱
            const response = JSON.parse(message.body);
            console.log("파싱된 응답:", response);
            // 명령 유형이 AVATAR_CARD이고 메시지가 SUCCESS인 경우 아바타 데이터 업데이트
            if (response.commandType === "AVATAR_CARD" && response.message === "SUCCESS") {
              console.log("아바타 데이터 업데이트:", response.data);
              setAvatarData(response.data);
            } else {
              console.log("예상치 못한 메시지 형식 또는 명령 유형:", response);
            }
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
          }
        });
  
        console.log("구독 성공:", subscription); // 구독 성공 로그

        // 서버로 아바타 데이터 요청
        console.log("서버로 아바타 데이터 요청 전송");
        stompClient.send(`/app/game/${roomId}/avatar`, {}, JSON.stringify({ userNo }));
        console.log("userNo:", userNo)
  
  
        // 컴포넌트 언마운트 시 구독 취소
        return () => {
          console.log("토픽 구독 취소:", `/topic/game/${roomId}`);
          subscription.unsubscribe();
        };
      } else {
        console.error("Stomp 클라이언트가 연결되지 않았거나 roomId가 정의되지 않았습니다");
      }
    }, [stompClient, roomId]);
  
    // 데이터가 아직 로드되지 않았을 때 로딩 표시
    if (!avatarData) {
      console.log("아바타 데이터를 로드 중입니다..."); // 로딩 상태 로그
      return <div>로딩 중...</div>;
    }
  
    // 현재 유저의 userNo에 맞는 아바타 데이터를 가져옴
    const userAvatarData = avatarData[userNo];
    if (!userAvatarData) {
      console.log("유저의 아바타 데이터를 찾을 수 없습니다."); // 유저 아바타 데이터가 없는 경우 로그
      return <div>아바타 데이터를 찾을 수 없습니다.</div>;
    }
  
    // 데이터를 화면에 렌더링
    console.log("아바타 데이터 렌더링:", userAvatarData); // 렌더링 데이터 로그
    return (
      <ProfileCardContainer>
        <ProfileCardBackground src={profileCardImage} alt="프로필 카드 배경" />
        {/* 아바타 이미지 표시 */}
        <AvatarImage src={userAvatarData.avatarImage} alt={`아바타 ${userNo}`} />
        {/* 아바타 특징 목록 표시 */}
        <FeatureList>
          {userAvatarData.feature.map((feature, index) => (
            <FeatureItem key={index}>{feature}</FeatureItem>
          ))}
        </FeatureList>
      </ProfileCardContainer>
    );
  };
  
  export default Game1Avata;