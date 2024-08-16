import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

// 스타일링된 컴포넌트 정의
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
  transform: scaleX(-1); /* 비디오 좌우 반전 */
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
  const videoRef = useRef(null); // 비디오 요소 참조
  const nicknameList = useSelector((state) => state.nickname.nicknameList); // Redux에서 닉네임 목록 가져오기
  const localStream = useSelector((state) => state.room.localStream); // Redux에서 로컬 스트림 가져오기
  const subscribers = useSelector((state) => state.room.subscribers); // Redux에서 구독자 목록 가져오기

  const userNo = index + 1; // 인덱스를 기반으로 유저 번호 계산
  const userNickname =
    nicknameList.find((item) => item.num === userNo)?.nickname || ""; // 유저 번호에 해당하는 닉네임 찾기

  useEffect(() => {
    let assigned = false;

    if (localStream) {
      const localUserNo = JSON.parse(localStream.connection.data).userNo;
      if (localUserNo === userNo && videoRef.current) {
        videoRef.current.srcObject = localStream.getMediaStream(); // 로컬 스트림을 비디오 요소에 할당
        assigned = true;
      }
    }

    if (!assigned) {
      const subscriber = subscribers.find((sub) => {
        return JSON.parse(sub.stream.connection.data).userNo === userNo;
      });
      if (subscriber && videoRef.current) {
        subscriber.addVideoElement(videoRef.current); // 구독자 스트림을 비디오 요소에 할당
      }
    }
  }, [localStream, subscribers, userNo, index]); // 의존성 배열 내의 값이 변경될 때마다 이 효과가 실행됨

  return (
    <Box>
      <Video ref={videoRef} autoPlay />
      {userNickname && <NameTag>{userNickname}</NameTag>} {/* 닉네임 태그 */}
    </Box>
  );
};

export default VideoBox;