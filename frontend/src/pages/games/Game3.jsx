import React, { useEffect, useRef, useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import red from "../../assets/icons/red.png";
import honaldu from "../../assets/images/igudong_ex_img.png";
import { useSelector } from "react-redux";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import OpenViduSession from "../../components/OpenViduSession";
// import PosePage from "../PosePage";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 페이지 스타일을 정의하는 styled-components
const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

// 이구동성 페이지 (Igudongseong)
const Game3 = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const userNo = useSelector((state) => state.auth.userNo);

  const [keywords, setKeywords] = useState([]);
  const [round, setRound] = useState(1);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isIgudongseongWelcomeModalOpen, setIsIgudongseongWelcomeModalOpen] =
    useState(true);
  const [isIgudongseongGuideModalOpen, setIsIgudongseongGuideModalOpen] =
    useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);

      console.log("수신 메시지 : ", parsedMessage);

      if (parsedMessage.commandType == "IGUDONGSEONG_CYCLE") {
        console.log("다음 라운드 시작================");
        setRound(round + 1);
      } else if (parsedMessage.message == "이구동성 시작!") {
        setKeywords(parsedMessage.data);
        console.log("이구동성 키워드~~~:", parsedMessage.data);
      }

      const cmd = parsedMessage.commandType;

      if (cmd == "GAME_MODAL_START") {
        setIsIgudongseongWelcomeModalOpen(false);
        setIsIgudongseongGuideModalOpen(false);
        setIsGameStarted(true);
      }
    });
  }, [client, roomId]);

  //5초 뒤 17개 포인트 서버에 전송. round마다 재시작
  useEffect(() => {
    if (isGameStarted == true) {
      // PoseNet을 실행하는 함수
      const runPoseNet = async (videoElement) => {
        // PoseNet 모델 로드
        const net = await posenet.load();

        // 비디오 요소에서 포즈 추정
        const pose = await net.estimateSinglePose(videoElement, {
          flipHorizontal: false, // 좌우 반전 비활성화
          decodingMethod: "single-person", // 단일 인물 디코딩 방식 사용
        });

        // console.log("Pose:", pose);

        const data = {
          num: userNo,
          keypoints: pose.keypoints,
        };
        console.log("전송 메시지 : ", data);
        client.send(`/app/game/${roomId}/similar`, {}, JSON.stringify(data));

        // 키포인트 중 점수가 0.6 이상인 것들만 로그로 출력
        pose.keypoints.forEach((keypoint) => {
          if (keypoint.score > 0.6) {
            const { y, x } = keypoint.position;
            // console.log(`Keypoint ${keypoint.part}: (${x}, ${y})`);
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
        }, 3000); // 5초 후에 포즈넷 실행
      }
    }
  }, [localStream, videoRef, round, isGameStarted]); // localStream이 변경될 때마다 useEffect 실행

  useEffect(() => {
    if (isGameStarted) {
      client.send(`/app/game/${roomId}/igudongseong`);
    }
  }, [isGameStarted]);

  // isIgudongseongWelcomeModalOpen 닫고 isIgudongseongGuideModalOpen 열기
  const openisIgudongseongGuideModalOpen = () => {
    setIsIgudongseongWelcomeModalOpen(false);
    setIsIgudongseongGuideModalOpen(true);
  };

  const closeIgudongseongGuideModal = () => {
    setIsIgudongseongGuideModalOpen(false);
  };

  return (
    <Wrap>
      {isIgudongseongWelcomeModalOpen && (
        <GameInfoModal
          planetImg={red}
          planetWidth="150px"
          RedBtnText={"게임 시작"}
          RedBtnFn={() =>
            client.send(`/app/game/${roomId}/start-modal/SAME_POSE`)
          }
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openisIgudongseongGuideModalOpen}
          modalText={"이구동성 게임에 오신걸 환영합니다 !"}
          // onClose={() => setIsIgudongseongWelcomeModalOpen(false)}
        />
      )}
      {isIgudongseongGuideModalOpen && (
        <GameModal
          exImg={honaldu}
          RedBtnText={"게임 시작"}
          RedBtnFn={() =>
            client.send(`/app/game/${roomId}/start-modal/SAME_POSE`)
          }
          modalText={
            <>
              EX) 호날두 <br /> 제시어가 주어지면, <br /> 위의 예처럼 포즈를
              취해주세요.
            </>
          }
          // onClose={() => setIsIgudongseongGuideModalOpen(false)}
        />
      )}
      이구동성 게임 화면
      {keywords}
      <h1>ROUND : {round}</h1>
      {/* <PosePage /> */}
      <PageWrap>
        <VideoCanvas ref={videoRef} width="640" height="480" />
        {/* OpenVidu 세션 컴포넌트에 토큰 전달 */}
        <OpenViduSession token={openViduToken} />
      </PageWrap>
      <button
        onClick={() => {
          // setRound(round + 1);
          client.send(`/app/game/${roomId}/igudongseong-cycle`);
          console.log(round);
        }}
      >
        버 튼
      </button>
    </Wrap>
  );
};

export default Game3;
