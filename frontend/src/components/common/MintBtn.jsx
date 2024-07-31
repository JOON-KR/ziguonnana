import React from "react";
import styled from "styled-components";

const Btn = styled.button`
  background-color: #27b3aa;
  font-size: 14px;
  color: white;
  width: 163px;
  height: 44px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const MintBtn = ({ text, BtnFn }) => {
  return (
    <div>
      <Btn onClick={() => BtnFn()}>{text}</Btn>
    </div>
  );
};

export default MintBtn;
