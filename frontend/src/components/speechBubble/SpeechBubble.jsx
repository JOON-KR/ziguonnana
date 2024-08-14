import React from "react";
import styled from "styled-components";
import sb from "../../assets/images/speechBubble.png";

const Wrap = styled.div`
  width: 412px;
  height: 124px;
  background-image: url(${sb});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ hasWord }) => (hasWord ? 'flex-start' : 'center')}; /* word가 없을 때 중앙 정렬 */
  padding-top: ${({ hasWord }) => (hasWord ? '30px' : '10px')}; /* word가 없을 때 패딩 제거 */
  padding-bottom: ${({ hasWord }) => (hasWord ? '0' : '30px')}; /* word가 없을 때 패딩 제거 */
`;

const TextBox = styled.div`
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: black;
  margin-top: 3px;
  margin-bottom: 8px;
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
