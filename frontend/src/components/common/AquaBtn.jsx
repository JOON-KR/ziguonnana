import React from "react";
import styled from "styled-components";

const BtnAqua = styled.button`
  background-color: #58fff5;
  font-size: 14px;
  font-weight: bold;
  color: #54595e;
  width: 163px;
  height: 44px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const AquaBtn = ({ text, BtnFn }) => {
  return (
    <div>
      <BtnAqua onClick={() => BtnFn()}>{text}</BtnAqua>
    </div>
  );
};

export default AquaBtn;
