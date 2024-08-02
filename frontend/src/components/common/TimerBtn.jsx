import React, { useState, useEffect } from "react";
import styled from "styled-components";

// 타이머 버튼 스타일 컴포넌트
const TimerBtnWrapper = styled.button`
  width: 301px;
  height: 117px;
  background-color: #d7d7d7;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #f6f8fa;
  font-weight: bold;
  cursor: pointer;
`;

// TimerBtn 컴포넌트 정의
const TimerBtn = ({ initialTime = 5, onTimerEnd }) => {
  const [time, setTime] = useState(initialTime);

  // 타이머 로직
  useEffect(() => {
    if (time <= 0) {
      if (onTimerEnd) onTimerEnd();
      return;
    }
    const timerId = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [time, onTimerEnd]);

  // 시간을 "MM:SS" 형식으로 포맷팅하는 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // 타이머 버튼 출력
  return <TimerBtnWrapper>{formatTime(time)}</TimerBtnWrapper>;
};

export default TimerBtn;
