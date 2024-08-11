import React, { useEffect, useRef, useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import red from "../../assets/icons/red.png";
import honaldu from "../../assets/images/igudong_ex_img.png";
import bigNana from "../../assets/images/bigNana.png";
import { useSelector } from "react-redux";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import OpenViduSession from "../../components/OpenViduSession";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative; /* 오버레이를 위한 상대적 위치 지정 */
`;

const VideoCanvas = styled.video`
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
  z-index: 1; /* 비디오를 가장 아래 레이어로 배치 */
`;

const BigNana = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  top: 420px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3; /* BigNana를 비디오 위에 오버레이 */
`;

const StyledSpeechBubble = styled(SpeechBubble)`
  width: 450px;
  height: 180px;
  margin-top: 200px;
  z-index: 2; /* SpeechBubble을 BigNana보다 뒤에, 비디오보다 앞에 오버레이 */
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const Game3 = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const userNo = useSelector((state) => state.auth.userNo);

  const [keywords, setKeywords] = useState([]);
  const [round, setRound] = useState(1);
  const videoRef = useRef(null);

  const [isIgudongseongWelcomeModalOpen, setIsIgudongseongWelcomeModalOpen] =
    useState(true);
  const [isIgudongseongGuideModalOpen, setIsIgudongseongGuideModalOpen] =
    useState(false);
  const [
    isIgudongseongSecondGuideModalOpen,
    setIsIgudongseongSecondGuideModalOpen,
  ] = useState(false);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showStartImages, setShowStartImages] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState("");

  useEffect(() => {
    const subscription = client.subscribe(
      `/topic/game/${roomId}`,
      (message) => {
        const parsedMessage = JSON.parse(message.body);

        if (parsedMessage.commandType === "IGUDONGSEONG_CYCLE") {
          console.log("다음 라운드 시작================");
          setRound((prevRound) => prevRound + 1);
          const nextKeyword = keywords[round];
          setCurrentKeyword(nextKeyword);
          setShowStartImages(true);

          setTimeout(() => {
            setShowStartImages(false);
            setIsGameStarted(true);
          }, 5000);
        } else if (parsedMessage.message === "이구동성 시작!\n") {
          console.log("이구동성 키워드 수신:", parsedMessage.data);
          setKeywords(parsedMessage.data);

          const keyword = parsedMessage.data[round - 1];
          setCurrentKeyword(keyword);
          console.log("현재 제시어:", keyword);

          setTimeout(() => {
            setShowStartImages(true);
          }, 100);
        } else if (
          parsedMessage.message === "성공!\n" ||
          parsedMessage.message === "실패!\n"
        ) {
          console.log(`결과 수신: ${parsedMessage.message}`);
          client.send(`/app/game/${roomId}/igudongseong-cycle`);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [client, roomId, round, keywords]);

  useEffect(() => {
    if (isGameStarted) {
      const runPoseNet = async (videoElement) => {
        const net = await posenet.load();

        const pose = await net.estimateSinglePose(videoElement, {
          flipHorizontal: false,
          decodingMethod: "single-person",
        });

        const data = {
          num: userNo,
          keypoints: pose.keypoints,
        };
        console.log("전송 메시지 : ", data);
        client.send(`/app/game/${roomId}/similar`, {}, JSON.stringify(data));
      };

      if (localStream && videoRef.current) {
        const videoElement = videoRef.current;

        if (localStream.getMediaStream) {
          // localStream이 Publisher인 경우
          videoElement.srcObject = localStream.getMediaStream();
        } else {
          // localStream이 MediaStream인 경우
          videoElement.srcObject = localStream;
        }

        videoElement.play();

        setTimeout(() => {
          runPoseNet(videoElement);
        }, 3000);
      }
    }
  }, [localStream, videoRef, round, isGameStarted]);

  const startGameSequence = () => {
    client.send(`/app/game/${roomId}/igudongseong`);

    setTimeout(() => {
      setIsIgudongseongWelcomeModalOpen(false);
      setIsIgudongseongGuideModalOpen(false);
      setIsIgudongseongSecondGuideModalOpen(false);
      setIsGameStarted(false);

      setShowStartImages(true);

      setTimeout(() => {
        setShowStartImages(false);
        setIsGameStarted(true);
      }, 5000);
    }, 100);
  };

  return (
    <Wrap>
      {isIgudongseongWelcomeModalOpen && (
        <GameInfoModal
          planetImg={red}
          planetWidth="150px"
          BlueBtnText={"게임 설명"}
          BlueBtnFn={() => setIsIgudongseongGuideModalOpen(true)}
          modalText={"이구동성 게임에 오신걸 환영합니다 !"}
        />
      )}
      {isIgudongseongGuideModalOpen && (
        <GameModal
          exImg={honaldu}
          RedBtnText={"다음"}
          RedBtnFn={() => setIsIgudongseongSecondGuideModalOpen(true)}
          modalText={
            <>
              EX) 호날두 <br /> 제시어가 주어지면, <br /> 위의 예처럼 포즈를
              취해주세요.
            </>
          }
        />
      )}
      {isIgudongseongSecondGuideModalOpen && (
        <GameModal
          exImg={honaldu}
          RedBtnText={"게임 시작"}
          RedBtnFn={startGameSequence}
          modalText={
            <>
              위 사진처럼 전신이 다 나와야 하며 <br />
              최대한 화면에 몸을 정중앙에 <br />
              맞춰주세요.
            </>
          }
        />
      )}
      {showStartImages && (
        <>
          <StyledSpeechBubble
            text={
              <>
                제시어: {currentKeyword}
                <br />
                5초 안에 포즈를 취하세요!
              </>
            }
          />
          <BigNana src={bigNana} alt="캐릭터" />
        </>
      )}
      {!showStartImages && isGameStarted && (
        <PageWrap>
          <VideoCanvas ref={videoRef} width="640" height="480" />
        </PageWrap>
      )}
      {openViduToken && <OpenViduSession token={openViduToken} />}
    </Wrap>
  );
};

export default Game3;
