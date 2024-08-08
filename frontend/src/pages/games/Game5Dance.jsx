import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledH2 = styled.h2`
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
`;

const VideoWrapper = styled.div`
  width: 90%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000; /* 비디오 주위에 검정색 배경 추가 */
  border-radius: 10px; /* 비디오 주위에 둥근 테두리 추가 */
  overflow: hidden; /* 자식 요소가 부모 요소를 벗어나지 않도록 설정 */
  cursor: pointer;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 10px; /* 비디오에 둥근 테두리 추가 */
  object-fit: cover; /* 비디오가 부모 요소를 완전히 덮도록 설정 */
`;

const Modal = styled.div`
  position: fixed; /* 모달을 화면에 고정 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 모달을 화면 중앙으로 이동 */
  width: 300px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 800px; /* 최대 너비 설정 */
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const CloseButton = styled.button`
  background: red;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
`;

const SelectButton = styled.button`
  background: green;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
`;

const TimeDisplay = styled.div`
  margin-top: 10px;
  font-size: 14px;
`;

const Game5Dance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const videoRef = useRef(null);

  const handleThumbnailClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectVideo = () => {
    alert("비디오가 선택되었습니다.");
    setIsModalOpen(false);
  };

  const updateTime = () => {
    if (videoRef.current) {
      const minutes = Math.floor(videoRef.current.currentTime / 60);
      const seconds = Math.floor(videoRef.current.currentTime % 60);
      setCurrentTime(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const minutes = Math.floor(videoRef.current.duration / 60);
      const seconds = Math.floor(videoRef.current.duration % 60);
      setDuration(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }
  };

  return (
    <Wrap>
      <StyledH2>챌린지 영상 선택</StyledH2>
      <VideoWrapper onClick={handleThumbnailClick}>
        <StyledVideo>
          <source src="https://ziguonnana.s3.ap-northeast-2.amazonaws.com/shortsExample/e208cace-0f18-4dad-a2f7-e5d441870fe0.mp4" type="video/mp4" />
          브라우저가 동영상을 지원하지 않습니다.
        </StyledVideo>
      </VideoWrapper>
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <StyledVideo
              ref={videoRef}
              controls
              onTimeUpdate={updateTime}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src="https://ziguonnana.s3.ap-northeast-2.amazonaws.com/shortsExample/e208cace-0f18-4dad-a2f7-e5d441870fe0.mp4" type="video/mp4" />
              브라우저가 동영상을 지원하지 않습니다.
            </StyledVideo>
            <TimeDisplay>재생 시간: {currentTime} / 전체 시간: {duration}</TimeDisplay>
            <ButtonBox>
              <CloseButton onClick={handleCloseModal}>닫기</CloseButton>
              <SelectButton onClick={handleSelectVideo}>선택</SelectButton>
            </ButtonBox>
          </ModalContent>
        </Modal>
      )}
    </Wrap>
  );
};

export default Game5Dance;
