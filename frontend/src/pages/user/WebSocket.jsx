import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import profileImg from '../assets/icons/p1.PNG';

const SocketTest = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [roomId, setRoomId] = useState('room1');
  const [profile, setProfile] = useState({
    name: 'User1',
    profileImage: profileImg,
    feature: '활발한',
  });

  useEffect(() => {
    const socket = new SockJS('http://localhost:8081/ws');
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      setStatusMessage('웹소켓 서버와 연결됨!');
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        console.log('받은 메시지:', message.body);
        setMessages((prevMessages) => [...prevMessages, message.body]);
      });

      setStompClient(client);
    }, (error) => {
      setStatusMessage('웹소켓 서버와 연결 끊김!');
      console.error('STOMP error:', error);
    });

    return () => {
      if (client) {
        client.disconnect(() => {
          setStatusMessage('웹소켓 서버와 연결 끊김!');
        });
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/game/${roomId}/send`, {}, JSON.stringify({ content: inputValue }));
      setInputValue('');
    }
  };

  const createRoom = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/game/${roomId}/create`, {}, JSON.stringify(profile));
    }
  };

  const joinRoom = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/game/${roomId}/join`, {}, JSON.stringify(profile));
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
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocketTest;
