import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { v4 as uuidv4 } from "uuid"; // UUID를 생성하기 위해 추가
import profileImg from "../assets/icons/p1.PNG";
import { Stomp } from "@stomp/stompjs";
import BASE_URL from "../api/APIconfig";

const Test = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [roomId, setRoomId] = useState("room1");
  const [profile, setProfile] = useState({
    name: "User1",
    profileImage: profileImg,
    feature: ["활발한"],
  });
  const [sessionInfo, setSessionInfo] = useState({
    memberId: uuidv4(), // UUID로 랜덤하게 생성된 memberId
    num: null,
  });

  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    const client = Stomp.over(socket);

    client.connect(
      {},
      (frame) => {
        console.log("웹소켓 서버와 연결됨!", frame);
        setStatusMessage("웹소켓 서버와 연결됨!");

        // 방에 대한 구독
        client.subscribe(`/topic/game/${roomId}`, (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log("방에서 받은 메시지:", parsedMessage);
          setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        });

        // 각 memberId에 대한 구독
        client.subscribe(
          `/topic/game/${roomId}/${sessionInfo.memberId}`,
          (message) => {
            const parsedMessage = JSON.parse(message.body);
            console.log("개별 구독 받은 메시지:", parsedMessage);
            // 응답 메시지에서 num 저장
            if (parsedMessage.data && parsedMessage.data.num !== undefined) {
              setSessionInfo((prevSessionInfo) => ({
                ...prevSessionInfo,
                num: parsedMessage.data.num,
              }));
            }
          }
        );

        setStompClient(client);
      },
      (error) => {
        console.error("STOMP error:", error);
        setStatusMessage("웹소켓 서버와 연결 끊김!");
      }
    );

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("웹소켓 서버와 연결 끊김!");
          setStatusMessage("웹소켓 서버와 연결 끊김!");
        });
      }
    };
  }, [roomId]); // roomId가 변경될 때만 재구독하도록 설정

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      console.log("보내는 메시지:", {
        sender: profile.name,
        content: inputValue,
      });
      stompClient.send(
        `/app/game/${roomId}/chat`,
        {},
        JSON.stringify({ sender: profile.name, content: inputValue })
      );
      setInputValue("");
    }
  };

  const createRoom = () => {
    if (stompClient && stompClient.connected) {
      console.log("방 생성 요청:", { teamName: profile.name, people: 2 });
      stompClient.send(
        `/app/game/${roomId}/create`,
        {},
        JSON.stringify({
          teamName: profile.name,
          people: 2, // 임의로 설정, 필요에 따라 변경
          memberId: sessionInfo.memberId, // memberId 포함
        })
      );
    }
  };

  const joinRoom = () => {
    if (stompClient && stompClient.connected) {
      console.log("방 참가 요청:", {
        memberId: sessionInfo.memberId,
        profileImage: profile.profileImage,
        feature: profile.feature,
      });
      stompClient.send(
        `/app/game/${roomId}/${sessionInfo.memberId}/join`,
        {},
        JSON.stringify({
          memberId: sessionInfo.memberId,
          profileImage: profile.profileImage,
          feature: profile.feature,
        })
      );
    }
  };

  const sendSelfIntroduction = () => {
    if (stompClient && stompClient.connected) {
      console.log("자기소개 전송 요청:", {
        memberId: sessionInfo.memberId,
        answer: ["This is my answer."],
      });
      stompClient.send(
        `/app/game/${roomId}/self-introduction`,
        {},
        JSON.stringify({
          memberId: sessionInfo.memberId,
          answer: ["This is my answer."],
        })
      );
    }
  };

  const saveArt = () => {
    if (stompClient && stompClient.connected) {
      console.log("그림 저장 요청:", {
        num: 1,
        keyword: "예시 키워드",
        art: "그림 데이터",
      });
      stompClient.send(
        `/app/game/${roomId}/saveArt`,
        {},
        JSON.stringify({
          num: 1, // 임의로 설정, 필요에 따라 변경
          keyword: "예시 키워드",
          art: "그림 데이터", // 예시 데이터
        })
      );
    }
  };

  const createProfile = () => {
    if (stompClient && stompClient.connected) {
      const profileRequest = {
        memberId: sessionInfo.memberId, // 저장된 memberId 사용
        num: sessionInfo.num, // 저장된 num 사용
        profileImage: profile.profileImage,
        feature: profile.feature,
        name: profile.name,
      };

      console.log("프로필 생성 요청:", profileRequest);
      stompClient.send(
        `/app/game/${roomId}/profile`,
        {},
        JSON.stringify(profileRequest)
      );
    }
  };

  return (
    <div>
      <h1>웹소켓 테스트</h1>
      <p>{statusMessage}</p>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>보냄</button>
      </div>
      <div>
        <button onClick={createRoom}>방 생성</button>
        <button onClick={joinRoom}>방 참가</button>
        <button onClick={sendSelfIntroduction}>자기소개 전송</button>
        <button onClick={saveArt}>그림 저장</button>
        <button onClick={createProfile}>프로필 생성</button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{JSON.stringify(message)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Test;
