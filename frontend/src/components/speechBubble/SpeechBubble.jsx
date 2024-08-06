import React from "react";
import styled from "styled-components";
import sb from "../../assets/images/speechBubble.png";

const Wrap = styled.div`
  width: 824px;
  height: 295px;
  position: relative;
  background-image: url(${sb});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const TextBox = styled.div`
  z-index: 2;
  width: 100%;
  height: 80%;
  padding-right: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: black;
`;

const SpeechBubble = ({ text }) => {
  return (
    <Wrap>
      <TextBox>{text}</TextBox>
    </Wrap>
  );
};

export default SpeechBubble;
