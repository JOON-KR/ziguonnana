import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import blue from "../../assets/icons/blue.png";
import Game1Drawing from "./Game1Drawing"
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import BASE_URL from "../../api/APIconfig";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

// 자기소개 문답 모달 & 이어그리기 페이지 (Drawing)
const Game1 = ({ roomId }) => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionWelcomeModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingWelcomeModalOpen, setIsDrawingWelcomeModalOpen] = useState(false); // DrawingWelcomeModal 상태
  const [isDrawingGuideModalOpen, setIsDrawingGuideModalOpen] = useState(false); // DrawingGuideModal 상태
  const [memberId, setMemberId] = useState(""); // 현재 사용자 ID 상태
  const [members, setMembers] = useState(['member1', 'member2', 'member3', 'member4', 'member5', 'member6']); // 멤버 리스트
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0); // 현재 멤버 인덱스 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const navigate = useNavigate();
  // const [statusMessage, setStatusMessage] = useState(''); // 상태 메시지 상태
  // const [messages, setMessages] = useState([]); // 메시지 배열 상태
  // const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 상태

  // 웹소켓 연결 설정
  // useEffect(() => {
  //   const socket = new SockJS(`${BASE_URL}/ws`); // SockJS 객체 생성
  //   const client = Stomp.over(socket); // STOMP 클라이언트 객체 생성

  //   // 웹소켓 서버에 연결
  //   client.connect({}, (frame) => {
  //     setStatusMessage('웹소켓 서버와 연결됨!');

  //     // 특정 경로 구독하여 메시지 수신
  //     client.subscribe(`/topic/game/${roomId}`, (message) => {
  //       console.log('받은 메시지:', message.body);
  //       setMessages((prevMessages) => [...prevMessages, message.body]); // 받은 메시지를 상태에 추가
  //     });

  //     // 세션 정보 구독하여 memberId 저장
  //     client.subscribe(`/user/queue/session`, (message) => {
  //       const sessionInfo = JSON.parse(message.body);
  //       setMemberId(sessionInfo.memberId);
  //       localStorage.setItem('memberId', sessionInfo.memberId); // memberId를 로컬 스토리지에 저장
  //     });

  //     setStompClient(client); // STOMP 클라이언트 객체를 상태로 저장
  //   }, (error) => {
  //     setStatusMessage('웹소켓 서버와 연결 끊김!');
  //     console.error('STOMP error:', error);
  //   });

  //   // 컴포넌트 언마운트 시 또는 roomId 변경 시 실행되는 정리 작업
  //   return () => {
  //     if (client) {
  //       client.disconnect(() => {
  //         setStatusMessage('웹소켓 서버와 연결 끊김!');
  //       });
  //     }
  //   };
  // }, [roomId]);

  // IntroductionGuideModal 닫고 IntroductionModal 열기
  const openIntroModal = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  // IntroductionGuideModal 닫기
  const closeIntroGuideModal = () => {
    setIsIntroGuideModalOpen(false);
  };

  // IntroductionModal 닫기
  const closeIntroModal = () => {
    setIsIntroModalOpen(false);
  };

  // IntroductionModal 닫고 DrawingWelcomeModal 열기
  const openDrawingWelcomeModal = () => {
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true);
  };

  // DrawingWelcomeModal 닫기
  const closeDrawingWelcomeModal = () => {
    setIsDrawingWelcomeModalOpen(false);
  };

  // DrawingGuideModal 닫기
  const closeDrawingGuideModal = () => {
    setIsDrawingGuideModalOpen(false);
  };

  // DrawingWelcomeModal 닫고 DrawingGuideModal 열기
  const openDrawingGuideModal = () => {
    setIsDrawingWelcomeModalOpen(false);
    setIsDrawingGuideModalOpen(true);
  };

  return (
    <Wrap>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "} {/* 에러 메시지 표시 */}
      {/* {statusMessage && <div>{statusMessage}</div>} 상태 메시지 표시 */}
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal
          onClose={closeIntroGuideModal}
          onConfirm={openIntroModal}
        />
      )}
      {isIntroModalOpen && (
        <IntroductionModal onClose={openDrawingWelcomeModal} />
      )}
      {/* {isIntroModalOpen && memberId && ( // memberId가 설정된 후 모달 열기
        <IntroductionModal
        onClose={openDrawingWelcomeModal}
        onConfirm={() => setIsDrawingWelcomeModalOpen(true)} // IntroductionModal에서 DrawingWelcomeModal 열기
        roomId={roomId}
        memberId={memberId}
        />
        )} */}
      {/* 이어그리기 행성 입장 */}
      {isDrawingWelcomeModalOpen && (
        <GameInfoModal
          planetImg={blue}
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={closeDrawingWelcomeModal}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openDrawingGuideModal}
          modalText={"이어그리기 게임에 오신걸 환영합니다 !"}
          onClose={closeDrawingWelcomeModal}
        />
      )}
      {isDrawingGuideModalOpen && (
        <GameModal
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={closeDrawingGuideModal}
          modalText={
            <>
              주어지는 이미지와 특징을 바탕으로 <br /> 아바타를 그려주세요.{" "}
              <br />
              제한시간은 20초입니다.
            </>
          }
          onClose={closeDrawingGuideModal}
        />
      )}
      {!isIntroGuideModalOpen && !isIntroModalOpen && !isDrawingWelcomeModalOpen && !isDrawingGuideModalOpen && (
        <Game1Drawing roomId={roomId} />
      )}
      {/* 결과화면 재생이 끝난 후 버튼 표시 */}
      <button onClick={() => navigate('/icebreaking/games/game1NickName')}>별명짓기</button>
    </Wrap>
  );
};

export default Game1;
