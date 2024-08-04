import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import DrawingModal from "../../components/modals/DrawingModal"; // DrawingModal import 추가
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import BASE_URL from '../../api/APIconfig';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  text-align: center;
`;

// 자기소개 문답 페이지
// & 이어그리기 <- 만들어야함
const Game1 = ({ roomId }) => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionGuideModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false); // DrawingModal 상태
  const [memberId, setMemberId] = useState(''); // 현재 사용자 ID 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [statusMessage, setStatusMessage] = useState(''); // 상태 메시지 상태
  const [messages, setMessages] = useState([]); // 메시지 배열 상태
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 상태

  // 웹소켓 연결 설정
  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws`); // SockJS 객체 생성
    const client = Stomp.over(socket); // STOMP 클라이언트 객체 생성

    // 웹소켓 서버에 연결
    client.connect({}, (frame) => {
      setStatusMessage('웹소켓 서버와 연결됨!');
      
      // 특정 경로 구독하여 메시지 수신
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        console.log('받은 메시지:', message.body);
        setMessages((prevMessages) => [...prevMessages, message.body]); // 받은 메시지를 상태에 추가
      });
      
      // 세션 정보 구독하여 memberId 저장
      client.subscribe(`/user/queue/session`, (message) => {
        const sessionInfo = JSON.parse(message.body);
        setMemberId(sessionInfo.memberId);
        localStorage.setItem('memberId', sessionInfo.memberId); // memberId를 로컬 스토리지에 저장
      });

      setStompClient(client); // STOMP 클라이언트 객체를 상태로 저장
    }, (error) => {
      setStatusMessage('웹소켓 서버와 연결 끊김!');
      console.error('STOMP error:', error);
    });

    // 컴포넌트 언마운트 시 또는 roomId 변경 시 실행되는 정리 작업
    return () => {
      if (client) {
        client.disconnect(() => {
          setStatusMessage('웹소켓 서버와 연결 끊김!');
        });
      }
    };
  }, [roomId]);

  // IntroductionGuideModal 닫고 IntroductionModal 열기
  const openIntroModal = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  // IntroductionGuideModal 닫기
  const closeIntroGuideModal = () => {
    setIsIntroGuideModalOpen(false);
  };

  // IntroductionModal 닫고 DrawingModal 열기
  const openDrawingModal = () => {
    setIsIntroModalOpen(false);
    setIsDrawingModalOpen(true); // IntroductionModal 닫을 때 DrawingModal 열기
  };

  return (
    <Wrap>
      {error && <div style={{ color: "red" }}>{error}</div>} {/* 에러 메시지 표시 */}
      {statusMessage && <div>{statusMessage}</div>} {/* 상태 메시지 표시 */}

      {isIntroGuideModalOpen && (
        <IntroductionGuideModal onClose={closeIntroGuideModal} onConfirm={openIntroModal} />
      )}
      {isIntroModalOpen && memberId && ( // memberId가 설정된 후 모달 열기
        <IntroductionModal
          onClose={openDrawingModal}
          onConfirm={() => setIsDrawingModalOpen(true)} // IntroductionModal에서 DrawingModal 열기
          roomId={roomId}
          memberId={memberId}
        />
      )}
      {isDrawingModalOpen && (
        <DrawingModal onClose={() => setIsDrawingModalOpen(false)} /> // DrawingModal 컴포넌트 추가
      )}
    </Wrap>
  );
};

export default Game1;
