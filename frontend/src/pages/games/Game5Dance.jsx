import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/APIconfig";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const Countdown = styled.div`
  font-size: 48px;
  color: red;
  font-weight: bold;
  margin-bottom: 20px;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 70%;
`;

const VideoWrapper = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChallengeVideo = styled.video`
  width: 100%;
  max-width: 600px;
  height: 400px;
  border-radius: 10px;
  background-color: #000;
`;

const UserVideo = styled.video`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
  background-color: black;
`;

const NextButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #58FFF5;
  color: #54595E;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Game5Dance = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const userNo = useSelector((state) => state.auth.userNo);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const subscribers = useSelector((state) => state.room.subscribers);

  const userVideoRef = useRef(null);
  const subscriberVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const [countdown, setCountdown] = useState(3);
  const [currentUserNo, setCurrentUserNo] = useState(1);
  const [maxNo, setMaxNo] = useState(1);
  const [challengeVideoUrl, setChallengeVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState(5000); 
  const [isRecording, setIsRecording] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("userNo는: ", userNo);
    console.log("currentUserNo는: ", currentUserNo);
    console.log("maxNo는: ", maxNo);
  }, [userNo, currentUserNo, maxNo]);

  useEffect(() => {
    if (localStream && userVideoRef.current && currentUserNo === userNo) {
      userVideoRef.current.srcObject = localStream.getMediaStream();
      console.log("로컬 스트림이 비디오 요소에 설정되었습니다.", localStream);
    }
  }, [localStream, currentUserNo, userNo]);

  useEffect(() => {
    if (subscribers.length > 0 && subscriberVideoRef.current && currentUserNo !== userNo) {
      const subscriber = subscribers.find(
        (sub) => sub.stream.connection.data === `{"userNo":${currentUserNo}}`);
      if (subscriber) {
        subscriberVideoRef.current.srcObject = subscriber.stream.getMediaStream();
        console.log("서브스크립션 스트림이 비디오 요소에 설정되었습니다.", subscriber.stream);    
      } 
    }
  }, [subscribers, currentUserNo, userNo]);

  useEffect(() => {
    if (client && client.connected) {
      console.log("send:", `/app/game/${roomId}/shorts/record/${currentUserNo}`);
      client.send(`/app/game/${roomId}/shorts/record/${currentUserNo}`, {}, {});
    } else {
      console.warn("send 부분에서 문제 발생");
    }
  }, [client, roomId, currentUserNo]);

  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        try {
          console.log("서버로부터 받은 메시지:", message.body);
          const response = JSON.parse(message.body);
          if (response.commandType === "SHORTS_SPLITED" && response.message === "SUCCESS") {
            console.log("서버로부터 받은 데이터:", response.data);
            setCurrentUserNo(response.data.currentUserNo);
            setMaxNo(response.data.maxNo);
            setChallengeVideoUrl(response.data.challengeVideoUrl);
            setVideoDuration(response.data.videoDuration || 5000);
            setCountdown(3);
            setIsButtonVisible(false);
            setIsRecording(false);
            setShouldPlayVideo(false);
          } else if (response.commandType === "SHORTS_RECORD_END" && response.message === "SUCCESS") {
            console.log("게임 종료, 다같이 이동");
            navigate("/icebreaking/games/game5Result");
          }
        } catch (error) {
          console.error("메시지 처리 중 오류 발생:", error);
        }
      });

      return () => {
        console.log("구독을 취소합니다.");
        subscription.unsubscribe();
      };
    } else {
      console.warn("클라이언트가 연결되지 않았거나 문제가 발생했습니다.");
    }
  }, [client, roomId]);

  useEffect(() => {
    let interval;
    if (challengeVideoUrl && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
      setShouldPlayVideo(true);
      startRecording();
    }

    return () => clearInterval(interval);
  }, [challengeVideoUrl, countdown, currentUserNo, userNo]);

  const startRecording = () => {
    if (currentUserNo === userNo && !isRecording) {
      setIsRecording(true);
      console.log("현재 녹화되고 있는 사용자 번호: ", currentUserNo);

      recordedChunks.current = [];
      const options = { mimeType: "video/webm; codecs=vp9" };
      const mediaRecorder = new MediaRecorder(localStream.getMediaStream(), options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("녹화된 데이터 청크:", event.data);
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        console.log("녹화된 Blob:", blob);

        const formData = new FormData();
        formData.append("file", blob, `${roomId}_user_${currentUserNo}.webm`);

        axios.post(`${BASE_URL}/api/v1/video/${roomId}/member/${currentUserNo}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then(response => {
          console.log("녹화된 비디오 업로드 성공:", response.data);
        }).catch(error => {
          console.error("비디오 업로드 실패:", error);
        });

        setIsButtonVisible(true);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, videoDuration);
    }
  };

  const handleNextUser = () => {
    setIsButtonVisible(false);

    if (currentUserNo < maxNo) {
      console.log("다음 사용자로 요청을 보냅니다:", currentUserNo + 1);
      client.send(`/app/game/${roomId}/shorts/record/${currentUserNo + 1}`, {}, {});
    } else if (currentUserNo === maxNo) {
      console.log("모든 사용자가 완료되었습니다.");
      // 게임 종료 요청을 서버로 전송
      client.send(`/app/game/${roomId}/shorts/end`, {}, {});
    }
  };

  return (
    <Container>
      <Title>{currentUserNo} 번째 팀원의 순서입니다.</Title>
      {countdown > 0 && <Countdown>{countdown}</Countdown>}
      <VideoContainer>
        <VideoWrapper>
          {shouldPlayVideo && challengeVideoUrl && (
            <ChallengeVideo
              src={challengeVideoUrl}
              controls={false}
              autoPlay
            />
          )}
        </VideoWrapper>
        <VideoWrapper>
          {currentUserNo === userNo ? (
            <UserVideo ref={userVideoRef} autoPlay muted />
          ) : (
            <UserVideo ref={subscriberVideoRef} autoPlay muted />
          )}
        </VideoWrapper>
      </VideoContainer>
      {isButtonVisible && (
        <NextButton onClick={handleNextUser}>
          다음 팀원으로
        </NextButton>
      )}
    </Container>
  );
};

export default Game5Dance;
