import React from "react";
import styled from "styled-components";

// 비디오 썸네일을 표시하는 스타일 컴포넌트
const ThumbnailContainer = styled.div`
  flex: 0 0 auto;
  width: 220px;
  height: 150px;
  margin-right: 10px;
  cursor: pointer;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// VideoThumbnail 컴포넌트 정의
const VideoThumbnail = ({ thumbnailSrc, onClick }) => {
  return (
    <ThumbnailContainer onClick={onClick}>
      <ThumbnailImage src={thumbnailSrc} alt="Video Thumbnail" />
    </ThumbnailContainer>
  );
};

export default VideoThumbnail;
