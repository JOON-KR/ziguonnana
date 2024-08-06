import React from "react";
import styled from "styled-components";
import sb from "../../assets/images/speechBubble.png";

const Wrap = styled.div`
  width: 600px; /* 크기를 줄였습니다 */
  height: 215px; /* 크기를 줄였습니다 */
  position: relative;
  background-image: url(${sb});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: -200px; /* 위치를 위로 올립니다 */
`;

const TextBox = styled.div`
  z-index: 2;
  width: 100%;
  height: 80%;
  padding-right: 40px; /* 패딩 조정 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
  text-align: center;
  font-size: 24px; /* 글꼴 크기를 줄였습니다 */
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
