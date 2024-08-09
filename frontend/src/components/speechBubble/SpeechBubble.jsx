import React from "react";
import styled from "styled-components";
import sb from "../../assets/images/speechBubble.png";

const Wrap = styled.div`
  width: 412px;
  height: 124px;
  position: relative;
  background-image: url(${sb});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px; /* 말풍선과 Nana 이미지 사이의 간격 추가 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 상단에 배치 */
  align-items: center;
  padding-top: 30px;
`;

const TextBox = styled.div`
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: black;
  // margin: 5px 0;
`;

const SpeechBubble = ({ type, word }) => {
  return (
    <Wrap>
      <TextBox>{type}</TextBox>
      {word && <TextBox>{word}</TextBox>}
    </Wrap>
  );
};

export default SpeechBubble;
