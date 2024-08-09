import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import GameInfoModal from "../../components/modals/GameInfoModal";
import OpenViduSession from "../../components/OpenViduSession";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import gray from "../../assets/icons/gray.png";
import transparentEdgeImage from "../../assets/images/transparent_edges_image.jpg";

// styled-components를 사용하여 스타일이 적용된 컴포넌트 정의
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
  position: relative;
`;

const OverlayImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
  opacity: 0.5;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
`;

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PoseSelectionModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 모달이 항상 최상위에 위치하도록 z-index 설정 */
`;

const PoseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
`;

const PoseItem = styled.button`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#007bff" : "#e0e0e0")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Game4 = () => {
  // 여러 모달의 열림 상태를 관리하는 state
  const [isFollowPoseWelcomeModalOpen, setIsFollowPoseWelcomeModalOpen] =
    useState(true); // 웰컴 모달 열림 상태
  const [isFollowPoseSelectModalOpen, setIsFollowPoseSelectModalOpen] =
    useState(false); // 포즈 선택 모달 열림 상태
  const [isPoseSystemModalOpen, setIsPoseSystemModalOpen] = useState(false); // 포즈 시스템 모달 열림 상태
  const [isPoseDrawingModalOpen, setIsPoseDrawingModalOpen] = useState(false); // 포즈 드로잉 모달 열림 상태

  // Redux를 통해 상태를 가져옴
  const roomId = useSelector((state) => state.room.roomId); // 현재 방 ID
  const client = useSelector((state) => state.client.stompClient); // STOMP 클라이언트
  const localStream = useSelector((state) => state.room.localStream); // 로컬 비디오 스트림
  const openViduToken = useSelector((state) => state.auth.openViduToken); // OpenVidu 토큰
  const userNo = useSelector((state) => state.auth.userNo); // 유저 번호

  const videoRef = useRef(null); // 비디오 엘리먼트를 참조하기 위한 ref
  const [isPoseSelectionModalOpen, setIsPoseSelectionModalOpen] =
    useState(false); // 포즈 선택 모달 열림 상태
  const [selectedPose, setSelectedPose] = useState(null); // 선택된 포즈 번호
  const [showOverlay, setShowOverlay] = useState(false); // 오버레이 이미지 표시 상태
  const [showText, setShowText] = useState(false); // 오버레이 텍스트 표시 상태

  // 클라이언트에서 서버로부터 메시지를 구독하고, 특정 명령어가 올 경우 모달 상태를 변경함
  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body); // 서버로부터 받은 메시지를 파싱
      const cmd = parsedMessage.commandType; // 명령어 타입을 추출

      if (cmd === "GAME_MODAL_START") {
        // 특정 명령어가 오면 모든 모달을 닫음
        setIsFollowPoseWelcomeModalOpen(false);
        setIsFollowPoseSelectModalOpen(false);
        setIsPoseSystemModalOpen(false);
        setIsPoseDrawingModalOpen(false);
      }

      console.log("키워드 타입 :", parsedMessage); // 디버깅을 위한 로그 출력
    });
  }, [client, roomId]);

  // 포즈넷을 실행하여 비디오 스트림에서 자세를 추정하고 결과를 서버로 전송하는 함수
  useEffect(() => {
    const runPoseNet = async (videoElement) => {
      const net = await posenet.load(); // PoseNet 모델 로드
      const pose = await net.estimateSinglePose(videoElement, {
        flipHorizontal: false,
        decodingMethod: "single-person",
      }); // 비디오에서 단일 인물의 자세를 추정

      console.log("Pose:", pose); // 추정된 포즈를 로그로 출력

      // 서버로 보낼 데이터 형식으로 변환
      const payload = {
        num: userNo, // 유저 번호를 포함
        keypoints: pose.keypoints.map((keypoint) => ({
          part: keypoint.part,
          position: keypoint.position,
          score: keypoint.score,
        })),
      };

      console.log("Sending pose result:", payload); // 전송할 데이터 로그 출력
      client.send(
        `/ws/app/game/${roomId}/pose/result`, // 서버로 PoseNet 결과 전송
        {},
        JSON.stringify(payload)
      );
    };

    // 로컬 스트림이 존재하고, 비디오 엘리먼트가 참조되어 있을 때 실행
    if (localStream && videoRef.current) {
      const videoElement = videoRef.current;
      videoElement.srcObject = localStream.getMediaStream(); // 비디오 엘리먼트에 로컬 스트림을 설정
      videoElement.onloadedmetadata = () => {
        videoElement.play(); // 메타데이터가 로드되면 비디오 재생
      };

      // 포즈가 선택된 경우, 오버레이와 텍스트를 표시하고, 지정된 시간 후에 PoseNet을 실행
      if (selectedPose !== null) {
        setShowOverlay(true);
        setShowText(true);
        setTimeout(() => {
          setShowText(false);
          setTimeout(() => {
            setShowOverlay(false);
            setTimeout(() => {
              runPoseNet(videoElement); // 1초 후에 PoseNet 실행
            }, 1000);
          }, 4000); // 오버레이 이미지를 4초 동안 표시
        }, 1000); // 텍스트를 1초 동안 표시
      }
    }
  }, [localStream, selectedPose, userNo, client, roomId]);

  // 각 버튼 클릭 시 모달 상태를 제어하는 함수들
  const openIsFollowPoseSelectModalOpen = () => {
    setIsFollowPoseWelcomeModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  const openIsPoseSystemModalOpen = () => {
    setIsFollowPoseSelectModalOpen(false);
    setIsPoseSystemModalOpen(true);
  };

  const openPoseSelectionModal = () => {
    setIsPoseSelectionModalOpen(true);
  };

  const closePoseSelectionModal = () => {
    setIsPoseSelectionModalOpen(false);
  };

  // 포즈를 선택한 후 서버로 전송하는 함수
  const selectPose = (poseNumber) => {
    setSelectedPose(poseNumber);
    closePoseSelectionModal();
  };

  const sendPoseSelection = () => {
    if (selectedPose !== null) {
      client.send(
        `/ws/app/game/${roomId}/pose/number`, // 선택된 포즈 번호를 서버로 전송
        {},
        JSON.stringify({ number: selectedPose })
      );
      setIsPoseSystemModalOpen(true); // 포즈 시스템 모달로 전환
    }
  };

  const backToSelectModal = () => {
    setIsPoseSystemModalOpen(false);
    setIsFollowPoseSelectModalOpen(true); // 포즈 선택 모달로 돌아가기
  };

  return (
    <Wrap>
      {isFollowPoseWelcomeModalOpen && (
        <GameInfoModal
          planetImg={gray}
          planetWidth="150px"
          BlueBtnText={"게임설명 보기"}
          BlueBtnFn={openIsFollowPoseSelectModalOpen}
          modalText={
            <>
              포즈 따라하기 게임에 오신걸 <br /> 환영합니다 !
            </>
          }
        />
      )}
      {isFollowPoseSelectModalOpen && (
        <GameInfoModal
          planetWidth="150px"
          RedBtnText={"포즈 선택"}
          RedBtnFn={openPoseSelectionModal}
          BlueBtnText={"선택 완료"}
          BlueBtnFn={sendPoseSelection}
          modalText={
            selectedPose !== null ? (
              <>
                {selectedPose}번 포즈를 선택하셨습니다. <br />
                이제 선택 완료 버튼을 눌러주세요.
              </>
            ) : (
              <>
                여러분이 따라해야 할 포즈가 <br /> 난이도와 함께 제공합니다.{" "}
                <br />
                방 생성자는 따라할 포즈를 선택하시고 <br />
                가운데 화면에 틀 안에서 나오는 <br /> 포즈를 따라하세요.
              </>
            )
          }
        />
      )}
      {isPoseSystemModalOpen && (
        <GameInfoModal
          planetWidth="150px"
          RedBtnText={"뒤로 가기"}
          RedBtnFn={backToSelectModal}
          BlueBtnText={"게임 시작"}
          BlueBtnFn={() =>
            client.send(`/app/game/${roomId}/start-modal/FOLLOW_POSE`)
          }
          modalText={
            <>
              여러분이 따라해야 할 포즈가 <br /> 제공됩니다. 제공된 포즈에 맞춰{" "}
              <br />
              최대한 유사하게 포즈를 취해주세요.
            </>
          }
        />
      )}
      {isPoseSelectionModalOpen && (
        <PoseSelectionModal>
          <h3>포즈를 선택하세요</h3>
          <PoseList>
            {Array.from({ length: 20 }, (_, index) => (
              <PoseItem
                key={index + 1}
                selected={selectedPose === index + 1}
                onClick={() => selectPose(index + 1)}
              >
                {index + 1}
              </PoseItem>
            ))}
          </PoseList>
        </PoseSelectionModal>
      )}
      <PageWrap>
        <Title>포즈 페이지</Title>
        <div style={{ position: "relative" }}>
          <VideoCanvas ref={videoRef} width="640" height="480" />
          {showOverlay && <OverlayImage src={transparentEdgeImage} />}
          {showText && (
            <OverlayText>
              화면에 나온 선에 맞춰 포즈를 따라해 주세요
            </OverlayText>
          )}
        </div>
        <OpenViduSession token={openViduToken} />
      </PageWrap>
    </Wrap>
  );
};

export default Game4;
