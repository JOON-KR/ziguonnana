import React, { useEffect, useState } from 'react';

const SocketTest = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [ws, setWs] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/game');

    socket.onopen = () => {
      setStatusMessage('웹소켓 서버와 연결됨!');
    };

    socket.onmessage = (event) => {
      console.log('받은 메시지:', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onclose = () => {
      setStatusMessage('웹소켓 서버와 연결 끊김!');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      ws.send(inputValue);
      setInputValue('');
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
