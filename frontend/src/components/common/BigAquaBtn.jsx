import React from "react";
import styled from "styled-components";

const Box = styled.div`
  width: 129px;
  height: 129px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
  color: #54595e;
  background-color: #58fff5;
`;

const BigAquaBtn = ({ text }) => {
  return <Box>{text}</Box>;
};

export default BigAquaBtn;
