import React from "react";
import styled from "styled-components";

const BtnGrey = styled.button`
  background-color: #d4d7d9;
  font-size: 14px;
  font-weight: bold;
  color: #54595e;
  width: 163px;
  height: 44px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const GreyBtn = ({ text, BtnFn }) => {
  return (
    <div>
      <BtnGrey onClick={() => BtnFn()}>{text}</BtnGrey>
    </div>
  );
};

export default GreyBtn;
