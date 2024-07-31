import React from "react";
import styled from "styled-components";

// 비디오 카드를 감싸는 스타일 컴포넌트
const Card = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const VideoThumbnail = styled.div`
  width: 220px;
  height: 150px;
  background-color: #eee;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoCard = ({ videos, onClick }) => {
  return (
    <Card>
      {videos.map((video, index) => (
        <VideoThumbnail key={index} onClick={() => onClick(video)}>
          <ThumbnailImage
            src={`https://via.placeholder.com/220x150?text=Video${index + 1}`}
            alt={`Video ${index + 1}`}
          />
        </VideoThumbnail>
      ))}
    </Card>
  );
};

export default VideoCard;
