import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Box = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ebeef1;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Video = styled.video`
  position: relative;
  width: 180px;
  height: 180px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
`;

const NameTag = styled.div`
  position: absolute;
  bottom: 10px;
  border-radius: 4px;
  display: inline-block;
  color: #f6f8fa;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  font-size: 12px;
  align-self: flex-start;
`;

const VideoBox = ({ index }) => {
  const videoRef = useRef(null);
  const subscribers = useSelector((state) => state.room.subscribers);

  useEffect(() => {
    if (subscribers.length > index && videoRef.current) {
      subscribers[index].addVideoElement(videoRef.current);
      console.log(`Added video element for subscriber ${index}`);
    }
  }, [subscribers, index]);

  return (
    <Box>
      <Video ref={videoRef} autoPlay />
      <NameTag>사용자 이름</NameTag>
    </Box>
  );
};

export default VideoBox;
