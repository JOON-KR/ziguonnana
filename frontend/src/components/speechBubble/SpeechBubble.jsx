import React from "react";
import styled from "styled-components";
import sb from "../../assets/images/speechBubble.png";

const Wrap = styled.div`
  width: 412px; /* 크기를 줄임 */
  height: 150px; /* 크기를 줄임 */
  position: relative;
  background-image: url(${sb});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px; /* 말풍선과 Nana 이미지 사이의 간격 추가 */
`;

const TextBox = styled.div`
  z-index: 2;
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  text-align: center;
  font-size: 16px; /* 글꼴 크기를 줄임 */
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
