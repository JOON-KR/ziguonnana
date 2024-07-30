import React, { useState, useEffect } from "react";
import styled from "styled-components";

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

const TimerBtn = ({ initialTime = 20, onTimerEnd }) => {
  const [time, setTime] = useState(initialTime);

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return <TimerBtnWrapper>{formatTime(time)}</TimerBtnWrapper>;
};

export default TimerBtn;
