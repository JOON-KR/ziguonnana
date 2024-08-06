import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { OpenVidu } from "openvidu-browser";
import {
  setPublisher,
  addSubscriber,
  clearSession,
} from "../../store/roomSlice";

const Box = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ebeef1;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Video = styled.video`
  position: relative;
  width: 180px;
  height: 180px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
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
  const dispatch = useDispatch();
  const session = useSelector((state) => state.room.session);
  const subscribers = useSelector((state) => state.room.subscribers);

  useEffect(() => {
    const initializePublisher = async () => {
      try {
        console.log("세션 상태:", session);

        // 권한 요청
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        const OV = new OpenVidu();
        const publisher = OV.initPublisher(videoRef.current, {
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        });

        session.publish(publisher);
        dispatch(setPublisher(publisher));
        console.log("퍼블리셔 설정됨:", publisher);
      } catch (error) {
        console.error("퍼블리셔 초기화 오류:", error);
      }
    };

    if (session && !subscribers.length) {
      initializePublisher();
    } else if (subscribers.length > index && videoRef.current) {
      subscribers[index].addVideoElement(videoRef.current);
    }

    return () => {
      if (session) {
        session.disconnect();
        dispatch(clearSession());
      }
    };
  }, [session, subscribers, index, dispatch]);

  return (
    <Box>
      <Video ref={videoRef} autoPlay />
      <NameTag>사용자 이름</NameTag>
    </Box>
  );
};

export default VideoBox;
