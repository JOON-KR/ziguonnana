import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  width: 824px;
  height: 295px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: 600;
`;

const NameCardMaking = () => {
  return <Wrap>그려진 아바타를 바탕으로 명함을 제작 중입니다.</Wrap>;
};

export default NameCardMaking;
