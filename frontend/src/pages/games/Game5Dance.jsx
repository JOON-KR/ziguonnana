import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ThumbnailWrapper = styled.div`
  width: 200px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  max-width: 300px;
  height: auto;
  max-height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-height: 100%;
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
  const [currentTime, setCurrentTime] = useState("00:00"); // 비디오 현재 시간
  const [duration, setDuration] = useState("00:00"); // 비디오 전체 시간
  const [selectedVideoId, setSelectedVideoId] = useState(null); // 선택한 비디오 ID
  const [videoSrc, setVideoSrc] = useState(""); // 선택한 비디오 소스 URL
  const [subscribed, setSubscribed] = useState(false);
  const videoRef = useRef(null); // 비디오 참조
  const roomId = useSelector((state) => state.room.roomId); 
  const client = useSelector((state) => state.client.stompClient);
  const userNo = useSelector((state) => state.auth.userNo);
  const navigate = useNavigate();

  //비디오 썸네일 클릭하면 모달이 열림
  const handleThumbnailClick = (videoId, videoUrl) => {
    setSelectedVideoId(videoId);
    setVideoSrc(videoUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  // 모달 안에 있는 선택 버튼 클릭하면 서버로 send
  const handleSelectVideo = () => {
    if (client && client.connected) {
      client.send(
        `/app/game/${roomId}/shorts/${selectedVideoId}`,
        {},
        JSON.stringify({ userNo })
      );
      console.log(`숏츠 선택 메시지를 전송했습니다: /app/game/${roomId}/shorts/${selectedVideoId}`);
    }
    setIsModalOpen(false);
  };

  // 비디오 현재 시간 업데이트
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

  // 비디오 메타데이터 로드 시 전체 시간 설정
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

  //구독
  useEffect(() => {
    if (client && client.connected && !subscribed) {
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        const response = JSON.parse(message.body);
        console.log("서버로부터 받은 메시지:", response);
        if (response.commandType === "SHORTS_CHOICE" && response.message === "SUCCESS") {
          console.log("숏츠 선택 결과를 받았습니다:", response.data);
          // navigate("icebreaking/games/game5TeamDance");
        }
      });
      setSubscribed(true);
    }
  }, [client, roomId, subscribed]);

  return (
    <Wrap>
      <StyledH2>챌린지 영상 선택</StyledH2>
      <VideoContainer>
        <ThumbnailWrapper onClick={() => handleThumbnailClick(1, "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/d569de89-1489-41e4-9801-006f8ee93b41.mp4")}>
          <StyledVideo>
            <source src="https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/d569de89-1489-41e4-9801-006f8ee93b41.mp4" type="video/mp4" />
          </StyledVideo>
        </ThumbnailWrapper>
        <ThumbnailWrapper onClick={() => handleThumbnailClick(2, "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/2/ef2c8d08-b9b1-4abd-8967-21601d5ebf9f.mp4")}>
          <StyledVideo>
            <source src="https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/2/ef2c8d08-b9b1-4abd-8967-21601d5ebf9f.mp4" type="video/mp4" />
          </StyledVideo>
        </ThumbnailWrapper>
      </VideoContainer>
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <StyledVideo
              ref={videoRef}
              controls
              onTimeUpdate={updateTime}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src={videoSrc} type="video/mp4" />
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