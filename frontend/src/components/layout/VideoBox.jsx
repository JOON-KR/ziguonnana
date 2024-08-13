import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import overlayImageSrc1 from "../../assets/images/your_image.png";
import overlayImageSrc2 from "../../assets/images/5.png";
import overlayImageSrc3 from "../../assets/images/image3.png";
import overlayImageSrc4 from "../../assets/images/image4.png";
import overlayImageSrc5 from "../../assets/images/image5.png";
import overlayImageSrc6 from "../../assets/images/image6.png";

// 이미지 경로들을 배열로 관리
const overlayImageList = [
  overlayImageSrc1,
  overlayImageSrc2,
  overlayImageSrc3,
  overlayImageSrc4,
  overlayImageSrc5,
  overlayImageSrc6,
];

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

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
  padding: 20px;
  transform: scaleX(-1); /* 캔버스 좌우 반전 */
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

const MaskButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const VideoBox = ({ index }) => {
  const videoRef = useRef(null); // 비디오 요소 참조
  const canvasRef = useRef(null); // 메인 캔버스 요소 참조
  const offscreenCanvasRef = useRef(null); // 오프스크린 캔버스 요소 참조 (화면에 표시되지 않음)
  const [isMaskApplied, setIsMaskApplied] = useState(false); // 마스크 적용 상태 관리
  const nicknameList = useSelector((state) => state.nickname.nicknameList); // Redux에서 닉네임 목록 가져오기
  const localStream = useSelector((state) => state.room.localStream); // Redux에서 로컬 스트림 가져오기
  const subscribers = useSelector((state) => state.room.subscribers); // Redux에서 구독자 목록 가져오기

  const userNo = index + 1; // 인덱스를 기반으로 유저 번호 계산
  const userNickname =
    nicknameList.find((item) => item.num === userNo)?.nickname || "사용자 이름"; // 유저 번호에 해당하는 닉네임 찾기

  // userNo에 따라 다른 이미지를 선택
  const overlayImageSrc = overlayImageList[userNo - 1];

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

  const applyMask = () => {
    if (isMaskApplied) {
      // 마스크를 제거하는 로직
      setIsMaskApplied(false);
      if (canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        ); // 캔버스 초기화
      }
      return;
    }

    setIsMaskApplied(true); // 마스크 적용 상태로 전환

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 6, // 최대 6명의 얼굴을 감지하도록 설정
      refineLandmarks: true, // 정밀 랜드마크 사용
      minDetectionConfidence: 0.5, // 얼굴 감지 신뢰도 설정
      minTrackingConfidence: 0.5, // 얼굴 추적 신뢰도 설정
    });

    faceMesh.onResults((results) => {
      if (canvasRef.current && offscreenCanvasRef.current) {
        const canvasCtx = canvasRef.current.getContext("2d"); // 메인 캔버스 컨텍스트 가져오기
        const offscreenCanvasCtx = offscreenCanvasRef.current.getContext("2d"); // 오프스크린 캔버스 컨텍스트 가져오기

        if (results.multiFaceLandmarks) {
          console.log(
            `Number of faces detected: ${results.multiFaceLandmarks.length}`
          );
          for (const landmarks of results.multiFaceLandmarks) {
            const noseTip = landmarks[1]; // 코 끝 좌표
            const chin = landmarks[152]; // 턱 좌표
            const leftCheek = landmarks[234]; // 왼쪽 볼 좌표
            const rightCheek = landmarks[454]; // 오른쪽 볼 좌표

            // 얼굴 높이 계산
            const faceHeight = Math.sqrt(
              Math.pow(
                (noseTip.x - chin.x) * offscreenCanvasRef.current.width,
                2
              ) +
                Math.pow(
                  (noseTip.y - chin.y) * offscreenCanvasRef.current.height,
                  2
                )
            );

            // 얼굴 너비 계산
            const faceWidth = Math.sqrt(
              Math.pow(
                (leftCheek.x - rightCheek.x) * offscreenCanvasRef.current.width,
                2
              ) +
                Math.pow(
                  (leftCheek.y - rightCheek.y) *
                    offscreenCanvasRef.current.height,
                  2
                )
            );

            const overlayHeight = faceHeight * 2; // 오버레이 이미지의 높이 설정
            const overlayWidth = faceWidth * 1.5; // 오버레이 이미지의 너비 설정

            const overlayX =
              noseTip.x * offscreenCanvasRef.current.width - overlayWidth / 2; // 오버레이 이미지의 X 위치 설정
            const overlayY =
              noseTip.y * offscreenCanvasRef.current.height - overlayHeight / 2; // 오버레이 이미지의 Y 위치 설정

            const overlayImage = new Image(); // 이미지 객체 생성
            overlayImage.src = overlayImageSrc; // 각 유저에 맞는 이미지 경로 설정
            overlayImage.onload = () => {
              offscreenCanvasCtx.clearRect(
                0,
                0,
                offscreenCanvasRef.current.width,
                offscreenCanvasRef.current.height
              ); // 오프스크린 캔버스 초기화
              offscreenCanvasCtx.drawImage(
                overlayImage,
                overlayX,
                overlayY,
                overlayWidth,
                overlayHeight
              ); // 오프스크린 캔버스에 오버레이 이미지 그리기

              // 오프스크린 캔버스의 내용을 메인 캔버스로 복사
              canvasCtx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
              canvasCtx.drawImage(offscreenCanvasRef.current, 0, 0);
            };
          }
        } else {
          console.log("No faces detected.");
        }
      }
    });

    if (videoRef.current) {
      const localUserNo =
        localStream && JSON.parse(localStream.connection.data).userNo;
      if (localUserNo === userNo) {
        // 로컬 스트림에 FaceMesh 적용
        console.log(`Applying FaceMesh to local stream for user ${userNo}`);
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await faceMesh.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });
        camera.start();
      } else {
        // 구독자 스트림에 FaceMesh 적용
        console.log(
          `Applying FaceMesh to subscriber stream for user ${userNo}`
        );
        const subscriber = subscribers.find(
          (sub) => JSON.parse(sub.stream.connection.data).userNo === userNo
        );
        if (subscriber) {
          const videoElement = document.createElement("video"); // 구독자 비디오 요소 생성
          videoElement.style.display = "none"; // 비디오 요소 숨김
          document.body.appendChild(videoElement); // 문서에 추가
          subscriber.addVideoElement(videoElement); // 구독자 스트림을 비디오 요소에 할당

          const camera = new Camera(videoElement, {
            onFrame: async () => {
              await faceMesh.send({ image: videoElement });
            },
            width: 640,
            height: 480,
          });
          camera.start();

          videoElement.addEventListener("loadeddata", () => {
            videoRef.current.srcObject = videoElement.srcObject; // FaceMesh 결과를 로컬 비디오 요소에 복사
            videoElement.remove(); // 비디오 요소 제거, FaceMesh 결과만 표시
            console.log("FaceMesh applied to subscriber video stream.");
          });
        }
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => {
        if (canvasRef.current && offscreenCanvasRef.current) {
          // 비디오가 로드되면 캔버스와 오프스크린 캔버스의 크기를 180px x 180px으로 고정
          canvasRef.current.width = 180;
          canvasRef.current.height = 180;
          offscreenCanvasRef.current.width = 180;
          offscreenCanvasRef.current.height = 180;
        }
      });
    }
  }, []);

  return (
    <Box>
      <Video ref={videoRef} autoPlay muted />
      <Canvas
        ref={canvasRef}
        style={{ display: isMaskApplied ? "block" : "none" }} // 마스크가 적용되었을 때만 캔버스를 표시
      />
      <canvas ref={offscreenCanvasRef} style={{ display: "none" }} />{" "}
      {/* 오프스크린 캔버스 숨김 */}
      <NameTag>{userNickname}</NameTag> {/* 닉네임 태그 */}
      <MaskButton onClick={applyMask}>
        {isMaskApplied ? "Remove Mask" : "Apply Mask"}{" "}
        {/* 마스크 상태에 따라 버튼 텍스트 변경 */}
      </MaskButton>
    </Box>
  );
};

export default VideoBox;