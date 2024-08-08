import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import GameInfoModal from "../../components/modals/GameInfoModal";
import OpenViduSession from "../../components/OpenViduSession";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import gray from "../../assets/icons/gray.png";
import transparentEdgeImage from "../../assets/images/transparent_edges_image.jpg";

// styled-components
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
  z-index: 1000; /* Ensure modal is in front */
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
  const [isFollowPoseWelcomeModalOpen, setIsFollowPoseWelcomeModalOpen] =
    useState(true);
  const [isFollowPoseSelectModalOpen, setIsFollowPoseSelectModalOpen] =
    useState(false);
  const [isPoseSystemModalOpen, setIsPoseSystemModalOpen] = useState(false);
  const [isPoseDrawingModalOpen, setIsPoseDrawingModalOpen] = useState(false);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const userNo = useSelector((state) => state.auth.userNo);
  const videoRef = useRef(null);
  const [isPoseSelectionModalOpen, setIsPoseSelectionModalOpen] =
    useState(false);
  const [selectedPose, setSelectedPose] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      const cmd = parsedMessage.commandType;

      if (cmd === "GAME_MODAL_START") {
        setIsFollowPoseWelcomeModalOpen(false);
        setIsFollowPoseSelectModalOpen(false);
        setIsPoseSystemModalOpen(false);
        setIsPoseDrawingModalOpen(false);
      }

      console.log("키워드 타입 :", parsedMessage);
    });
  }, [client, roomId]);

  useEffect(() => {
    const runPoseNet = async (videoElement) => {
      const net = await posenet.load();
      const pose = await net.estimateSinglePose(videoElement, {
        flipHorizontal: false,
        decodingMethod: "single-person",
      });

      console.log("Pose:", pose);

      const payload = {
        num: userNo,
        keypoints: pose.keypoints.map((keypoint) => ({
          part: keypoint.part,
          position: keypoint.position,
          score: keypoint.score,
        })),
      };

      console.log("Sending pose result:", payload);
      client.send(
        `/ws/app/game/${roomId}/pose/result`,
        {},
        JSON.stringify(payload)
      );
    };

    if (localStream && videoRef.current) {
      const videoElement = videoRef.current;
      videoElement.srcObject = localStream.getMediaStream();
      videoElement.onloadedmetadata = () => {
        videoElement.play();
      };

      if (selectedPose !== null) {
        setShowOverlay(true);
        setShowText(true);
        setTimeout(() => {
          setShowText(false);
          setTimeout(() => {
            setShowOverlay(false);
            setTimeout(() => {
              runPoseNet(videoElement);
            }, 1000);
          }, 4000);
        }, 1000);
      }
    }
  }, [localStream, selectedPose, userNo, client, roomId]);

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

  const selectPose = (poseNumber) => {
    setSelectedPose(poseNumber);
    closePoseSelectionModal();
  };

  const sendPoseSelection = () => {
    if (selectedPose !== null) {
      client.send(
        `/ws/app/game/${roomId}/pose/number`,
        {},
        JSON.stringify({ number: selectedPose })
      );
      setIsPoseSystemModalOpen(true); // 다음 모달로 이동
    }
  };

  const backToSelectModal = () => {
    setIsPoseSystemModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
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
