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
  const userNo = useSelector((state) => state.auth.userNo);

  // 현재 사용자의 별명만 필터링
  const userNickname = nicknameList.find((nicknameItem) => nicknameItem.num === userNo)?.nickname;

  return (
    <Wrap>
      <h2>당신의 별명은</h2>
      <NicknameList>
        <NicknameItem>{userNickname}</NicknameItem>
      </NicknameList>
      <h2>입니다.</h2>
    </Wrap>
  );
};

export default Game1Result;
