import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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
  background: black;
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
  top: 350px;
  right: 10px;
  width: 40px;
  height: 32px;
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
  top: 380px;
  right: 10px;
  color: white;
  font-size: 16px;
`;

const Title = styled.h3`
  position: absolute;
  bottom: 100px;
  width: 100%;
  text-align: left;
  color: white;
  font-size: 18px;
  padding-left: 15px;
`;

const VideoModal = ({
  videoSrc,
  videoType = "video/mp4",
  onClose,
  likeIcon,
  title,
  likeCount,
  showLikeAndTitle = true,
  articleId,
  onLike, // onLike 콜백 추가
}) => {
  const videoRef = useRef(null);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // 비디오 재생 위치를 처음으로 설정
      videoRef.current.play(); // 비디오를 처음부터 재생
    }
  }, [videoSrc]);

  const handleLikeClick = async () => {
    try {
      // 좋아요 POST 요청
      await axios.post("https://i11b303.p.ssafy.io/api/v1/article/like", { articleId });
      
      // 성공적으로 요청이 완료되면 리스트를 업데이트하도록 콜백 호출
      if (onLike) {
        onLike();
      }
    } catch (error) {
      console.error("Failed to like the video:", error);
    }
  };

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <VideoWrapper>
          <VideoPlayer ref={videoRef} src={videoSrc} type={videoType} controls />
        </VideoWrapper>
        {showLikeAndTitle && (
          <>
            <LikeButton icon={likeIcon} onClick={handleLikeClick} />
            <LikeCount>{currentLikeCount}</LikeCount>
            <Title>{title}</Title>
          </>
        )}
      </ModalContent>
    </ModalBackground>
  );
};

export default VideoModal;