import React from "react";
import styled from "styled-components";

const Btn = styled.button`
  background-color: #ff7373;
  font-size: 16px;
  color: white;
  width: 163px;
  height: 44px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

const RedBtn = ({ text, BtnFn }) => {
  return (
    <div>
      <Btn onClick={() => BtnFn()}>{text}</Btn>
    </div>
  );
};

export default RedBtn;
