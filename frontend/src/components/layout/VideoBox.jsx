import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

// Styled components
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
  const nicknameList = useSelector((state) => state.nickname.nicknameList);

  const userNickname = nicknameList.find((item) => item.num === index + 1)?.nickname;

  useEffect(() => {
    if (index === 0 && localStream && videoRef.current) {
      videoRef.current.srcObject = localStream.getMediaStream(); // 로컬 스트림 설정
      console.log("Added local video element");
    } else if (
      subscribers.length > index - 1 &&
      subscribers[index - 1] &&
      videoRef.current
    ) {
      subscribers[index - 1].addVideoElement(videoRef.current); // 구독자 비디오 요소 추가
      console.log(`Added video element for subscriber ${index - 1}`);
    }
  }, [subscribers, index, localStream]);

  return (
    <Box>
      <Video ref={videoRef} autoPlay />
      <NameTag>{userNickname || "사용자 이름"}</NameTag>
    </Box>
  );
};

export default VideoBox;
