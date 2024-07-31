import React from "react";
import styled from "styled-components";

// 모달의 배경을 어둡게 하는 스타일 컴포넌트
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

// 모달 내용을 감싸는 스타일 컴포넌트
const ModalContent = styled.div`
  background: black; /* 검은 배경 */
  width: 400px;
  height: 700px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const VideoPlayer = styled.video`
  max-width: 100%;
  max-height: 100%;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 32px;
  margin-top: 400px;
  background: url(${(props) => props.icon}) no-repeat center center;
  background-size: cover;
  border: none;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

const LikeCount = styled.div`
  position: absolute;
  top: 70px;
  right: 10px;
  color: white;
  font-size: 16px;
`;

const Title = styled.h3`
  position: absolute;
  bottom: 100px; /* 아래에서 100px 위 */
  width: 100%;
  text-align: left;
  color: white;
  font-size: 18px;
  padding-left: 15px;
`;

// VideoModal 컴포넌트 정의
const VideoModal = ({ video, onClose, likeIcon, title, likeCount }) => {
  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <VideoWrapper>
          <VideoPlayer controls>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </VideoPlayer>
        </VideoWrapper>
        <LikeButton icon={likeIcon} />
        <LikeCount>{likeCount}</LikeCount>
        <Title>{title}</Title>
      </ModalContent>
    </ModalBackground>
  );
};

export default VideoModal;
