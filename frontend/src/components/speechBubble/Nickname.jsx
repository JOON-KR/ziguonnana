import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  width: 582px;
  height: 245px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: 600;
`;

const Nickname = () => {
  return <Wrap>별명 스타일 정해.</Wrap>;
};

export default Nickname;
