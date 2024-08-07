import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const NicknameList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NicknameItem = styled.li`
  font-size: 30px;
  font-weight: bold;
  margin: 10px 0;
`;

const Game1Result = () => {
  const nicknameList = useSelector((state) => state.nickname.nicknameList);

  return (
    <Wrap>
      <h2>당신의 별명은 </h2>
      <NicknameList>
        {nicknameList.map((nicknameItem, index) => (
          <NicknameItem key={index}>
            {nicknameItem.nickname}
          </NicknameItem>
        ))}
      </NicknameList>
      <h2>입니다.</h2>
    </Wrap>
  );
};

export default Game1Result;
