import React, { createContext, useContext, useRef, useCallback } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import BASE_URL from "../api/APIconfig";

// 웹소켓 컨텍스트 생성
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  // stompClientRef를 useRef 훅을 사용하여 생성
  const stompClientRef = useRef(null);

  /**
   * 웹소켓 연결 함수
   *
   * @param {string} roomId - 웹소켓 연결 시 사용할 방 ID
   */
  const connectWebSocket = useCallback((roomId) => {
    if (stompClientRef.current) return; // 이미 연결되어 있으면 실행하지 않음

    // SockJS를 사용하여 소켓 생성
    const socket = new SockJS(`${BASE_URL}/ws`);
    // Stomp.js를 사용하여 소켓을 감싸고 클라이언트 생성
    const client = Stomp.over(socket);

    // 웹소켓 연결
    client.connect(
      {},
      (frame) => {
        console.log("웹소켓 연결 성공:", frame);

        // 특정 주제에 대해 구독 설정
        client.subscribe(`/topic/game/${roomId}`, (message) => {
          console.log("받은 메시지:", message.body);
        });

        // 세션 정보를 받아오기 위한 구독 설정
        client.subscribe(`/user/queue/session`, (message) => {
          const sessionInfo = JSON.parse(message.body);
          localStorage.setItem("memberId", sessionInfo.memberId);
          console.log("세션 정보 수신:", sessionInfo);
        });

        // stompClientRef에 연결된 클라이언트를 저장
        stompClientRef.current = client;
      },
      (error) => {
        console.error("웹소켓 연결 실패:", error);
      }
    );
  }, []);

  return (
    // WebSocketContext.Provider를 사용하여 컨텍스트 값 제공
    <WebSocketContext.Provider
      value={{ connectWebSocket, stompClient: stompClientRef.current }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

/**
 * WebSocket 컨텍스트를 사용하는 커스텀 훅
 *
 * @returns {object} - 웹소켓 연결 함수와 stompClient 객체를 포함하는 컨텍스트 값
 */
export const useWebSocket = () => useContext(WebSocketContext);
