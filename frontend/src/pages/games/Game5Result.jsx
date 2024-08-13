import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import clear1 from "../../assets/images/clear1.png";
import clear2 from "../../assets/images/clear2.png";
import nextBtn from "../../assets/icons/next_btn.png";
import backgroundMusic from "../../assets/audios/icebreaking.mp3";

const VideoPlayer = styled.video`
  width: 100%;
  height: 600px;
  object-fit: cover;
  margin: 0;
  border-radius: 10px;
`;

const ImageDisplay = styled.img`
  width: 600px;
  height: 600px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Header = styled.h1`
  font-size: 2rem;
  color: white;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid #58FFF5;
  animation: typing 10s steps(${(props) => props.textLength}, end) infinite, blink-caret 0.75s step-end infinite;

  @keyframes typing {
    0% {
      width: 0;
    }
    50% {
      width: 100%;
    }
    100% {
      width: 0;
    }
  }

  @keyframes blink-caret {
    from,
    to {
      border-color: transparent;
    }
    50% {
      border-color: #58FFF5;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const BottomContainer = styled.div`
  position: fixed;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NextButton = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background-color: #58FFF5;
  color: #54595E;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const NextImage = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const Game5Result = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const [mergeVideoUrl, setMergeVideoUrl] = useState("");
  const [showClear1, setShowClear1] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false); // 비디오 재생 완료 상태
  const message = "숏폼이 완성되기까지 최소 1분 소요됩니다.";
  const navigate = useNavigate();
  const audioRef = useRef(null); // 오디오 참조

  // clear 이미지 띄우기
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowClear1(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  // 숏폼 합치기 요청 send
  useEffect(() => {
    if (client && client.connected) {
      console.log("send 보냄");
      client.send(`/app/game/${roomId}/shorts/merge`, {}, {});
    } else {
      console.log("send 부분에서 문제가 발생함");
    }
  }, [client, roomId]);

  // 숏폼 합치기 응답 받기
  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        const response = JSON.parse(message.body);
        console.log("서버로부터 받은 메시지:", response);

        // SHORTS_MERGE 응답
        if (response.commandType === "SHORTS_MERGE" && response.message === "SUCCESS") {
          console.log("숏폼 합치기 완료");
        }

        // SHORTS_MERGE_COMPLETE 응답
        if (response.commandType === "SHORTS_MERGE_COMPLETE" && response.message === "SUCCESS") {
          console.log("합친 영상 가져오기 완료");
          setMergeVideoUrl(response.data);
        }
      });
      
      return () => subscription.unsubscribe();
    }
  }, [client, roomId]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleNext = () => {
    navigate("/icebreaking/games");
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 오디오를 자동으로 재생
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  return (
    <Container>
      <audio ref={audioRef} src={backgroundMusic} loop /> {/* 배경 음악 */}
      {mergeVideoUrl ? (
        <>
          <Header textLength={message.length}>우리의 숏폼이 완성되었습니다!</Header>
          <VideoPlayer controls autoPlay onEnded={handleVideoEnd}>
            <source src={mergeVideoUrl} type="video/mp4" />
          </VideoPlayer>
          {videoEnded && (
            <BottomContainer>
              <NextButton onClick={handleNext}>이동하기</NextButton>
              <NextImage src={nextBtn} alt="Next" onClick={handleNext} />
            </BottomContainer>
          )}
        </>
      ) : (
        <>
          {showClear1 ? (
            <>
              <Header textLength={message.length}>{message}</Header>
              <ImageDisplay src={clear1} alt="이미지1" />
            </>
          ) : (
            <>
              <Header textLength={message.length}>{message}</Header>
              <ImageDisplay src={clear2} alt="이미지2" />
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Game5Result;
