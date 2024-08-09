import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import OpenViduSession from "../components/OpenViduSession";

// 페이지 스타일을 정의하는 styled-components
const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const VideoCanvas = styled.video`
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
`;

const PosePage = () => {
  // Redux 스토어에서 localStream과 openViduToken을 가져옴
  const localStream = useSelector((state) => state.room.localStream);
  const openViduToken = useSelector((state) => state.auth.openViduToken);

  // 비디오와 캔버스 요소에 대한 ref 생성
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // PoseNet을 실행하는 함수
    const runPoseNet = async (videoElement) => {
      // PoseNet 모델 로드
      const net = await posenet.load();

      // 비디오 요소에서 포즈 추정
      const pose = await net.estimateSinglePose(videoElement, {
        flipHorizontal: false, // 좌우 반전 비활성화
        decodingMethod: "single-person", // 단일 인물 디코딩 방식 사용
      });

      console.log("Pose:", pose);

      // 키포인트 중 점수가 0.6 이상인 것들만 로그로 출력
      pose.keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.6) {
          const { y, x } = keypoint.position;
          console.log(`Keypoint ${keypoint.part}: (${x}, ${y})`);
        }
      });
    };

    // localStream과 videoRef가 존재하는 경우
    if (localStream && videoRef.current) {
      const videoElement = videoRef.current;
      // 비디오 요소의 소스를 localStream으로 설정
      videoElement.srcObject = localStream.getMediaStream();
      videoElement.play();

      // 5초 후에 PoseNet 실행
      setTimeout(() => {
        runPoseNet(videoElement);
      }, 5000); // 5초 후에 포즈넷 실행
    }
  }, [localStream]); // localStream이 변경될 때마다 useEffect 실행

  return (
    <PageWrap>
      <Title>포즈 페이지</Title>
      <VideoCanvas ref={videoRef} width="640" height="480" />
      {/* OpenVidu 세션 컴포넌트에 토큰 전달 */}
      <OpenViduSession token={openViduToken} />
    </PageWrap>
  );
};

export default PosePage;
