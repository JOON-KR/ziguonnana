import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
  padding: 20px;
  color: #ffffff;
`;

const ResultContainer = styled.div`
  background-color: #282c34;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const ResultText = styled.h1`
  font-size: 28px;
  color: #58fff5;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const ResultDetail = styled.p`
  font-size: 20px;
  color: #ff6b6b;
  margin: 10px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const Game2Result = () => {
  const location = useLocation();
  const { correctCnt, durationTime } = location.state;

  return (
    <Wrap>
      <ResultContainer>
        <ResultText>게임 결과</ResultText>
        <ResultDetail>맞춘 개수: {correctCnt}</ResultDetail>
        <ResultDetail>소요된 시간: {durationTime}초</ResultDetail>
      </ResultContainer>
    </Wrap>
  );
};

export default Game2Result;
