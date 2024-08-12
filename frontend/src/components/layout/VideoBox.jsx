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
  position: relative;
  width: 180px;
  height: 180px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  transform: scaleX(-1); /* 좌우 반전 */
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
  const nicknameList = useSelector((state) => state.nickname.nicknameList);
  const localStream = useSelector((state) => state.room.localStream);
  const subscribers = useSelector((state) => state.room.subscribers);

  // 해당 인덱스에 맞는 사용자 번호
  const userNo = index + 1;

  // 사용자 번호에 맞는 별명 찾기
  const userNickname =
    nicknameList.find((item) => item.num === userNo)?.nickname || "사용자 이름";

  useEffect(() => {
    let assigned = false;

    // 로컬 스트림 할당
    if (localStream) {
      const localUserNo = JSON.parse(localStream.connection.data).userNo;
      if (localUserNo === userNo && videoRef.current) {
        videoRef.current.srcObject = localStream.getMediaStream();
        assigned = true;
      }
    }

    // 구독자 스트림 할당
    if (!assigned) {
      const subscriber = subscribers.find((sub) => {
        return JSON.parse(sub.stream.connection.data).userNo === userNo;
      });

      if (subscriber && videoRef.current) {
        subscriber.addVideoElement(videoRef.current);
      }
    }
  }, [localStream, subscribers, userNo]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => {
        console.log(`Video element for userNo ${userNo} is playing`);
      });
    }
  }, [userNo]);

  return (
    <Box>
      <Video ref={videoRef} autoPlay />
      <NameTag>{userNickname}</NameTag>
    </Box>
  );
};

export default VideoBox;
