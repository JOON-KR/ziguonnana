import React, { useState } from "react";
import styled from "styled-components";
import TitleSettingModal from "./TitleSettingModal"; // Import TitleSettingModal
import MintBtn from "../../components/common/MintBtn"; // MintBtn import 추가
import blueIcon from "../../assets/icons/blue.png"; // Blue Icon 이미지 경로
import grayIcon from "../../assets/icons/gray.png"; // Gray Icon 이미지 경로
import redIcon from "../../assets/icons/red.png"; // Red Icon 이미지 경로

// 모달 카드 스타일 컴포넌트
const ModalCard = styled.div`
  width: 600px;
  height: 350px;
  background-color: rgba(196, 196, 196);
  border-radius: 35px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1001; /* overlay보다 위에 위치 */
`;

// 텍스트 스타일 컴포넌트
const Title = styled.h2`
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 20px;
`;

// 버튼 컨테이너 스타일 컴포넌트
const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

// 이미지 버튼 스타일 컴포넌트
const ImageButton = styled.button`
  width: 150px; /* 이미지 크기 조정 */
  height: 150px; /* 이미지 크기 조정 */
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  &:focus {
    outline: none;
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
`;

// 영상 확인 버튼 스타일 컴포넌트
const VideoButton = styled(MintBtn)`
  margin-top: 10px;
  width: 150px;
  height: 40px;
  font-size: 16px;
  align-self: center; /* 중앙 정렬 */
`;

// 좌우 토글 버튼 스타일 컴포넌트
const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1002;
`;

const PrevButton = styled(ToggleButton)`
  left: 10px;
`;

const NextButton = styled(ToggleButton)`
  right: 10px;
`;

const TeamRecordModal = ({ onClose, onVideoSelect }) => {
  const [isTitleSettingModalOpen, setIsTitleSettingModalOpen] = useState(false);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);

  const records = [
    {
      title: "아이스브레이킹 쇼츠 기록 1",
      videos: [
        {
          thumbnail: blueIcon,
          videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        },
        {
          thumbnail: grayIcon,
          videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
        },
        {
          thumbnail: redIcon,
          videoUrl: "https://media.w3.org/2010/05/video/movie_300.mp4",
        },
      ],
    },
    {
      title: "아이스브레이킹 쇼츠 기록 2",
      videos: [
        {
          thumbnail: grayIcon,
          videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
        },
        {
          thumbnail: blueIcon,
          videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        },
        {
          thumbnail: redIcon,
          videoUrl: "https://media.w3.org/2010/05/video/movie_300.mp4",
        },
      ],
    },
    {
      title: "아이스브레이킹 쇼츠 기록 3",
      videos: [
        {
          thumbnail: redIcon,
          videoUrl: "https://media.w3.org/2010/05/video/movie_300.mp4",
        },
        {
          thumbnail: grayIcon,
          videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
        },
        {
          thumbnail: blueIcon,
          videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        },
      ],
    },
    {
      title: "아이스브레이킹 쇼츠 기록 4",
      videos: [
        {
          thumbnail: blueIcon,
          videoUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        },
        {
          thumbnail: redIcon,
          videoUrl: "https://media.w3.org/2010/05/video/movie_300.mp4",
        },
        {
          thumbnail: grayIcon,
          videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
        },
      ],
    },
  ];

  const handleNextRecord = () => {
    setCurrentRecordIndex((prevIndex) => (prevIndex + 1) % records.length);
  };

  const handlePrevRecord = () => {
    setCurrentRecordIndex((prevIndex) =>
      prevIndex === 0 ? records.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = () => {
    setIsTitleSettingModalOpen(true);
  };

  const handleVideoButtonClick = (videoUrl) => {
    onVideoSelect(videoUrl);
  };

  return (
    <>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Title>{records[currentRecordIndex].title}</Title>
        <ButtonContainer>
          {records[currentRecordIndex].videos.map((image, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ImageButton
                style={{ backgroundImage: `url(${image.thumbnail})` }}
                onClick={handleImageClick}
              />
              <VideoButton
                onClick={() => handleVideoButtonClick(image.videoUrl)}
              >
                영상 확인
              </VideoButton>
            </div>
          ))}
        </ButtonContainer>
        <PrevButton onClick={handlePrevRecord}>{"<"}</PrevButton>
        <NextButton onClick={handleNextRecord}>{">"}</NextButton>
      </ModalCard>
      {isTitleSettingModalOpen && (
        <TitleSettingModal onClose={() => setIsTitleSettingModalOpen(false)} />
      )}
    </>
  );
};

export default TeamRecordModal;
