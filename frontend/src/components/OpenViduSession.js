import React, { useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  setSession,
  setPublisher,
  addSubscriber,
  clearSession,
} from "../store/roomSlice"; // roomSlice의 액션들 가져오기

// 비디오 컨테이너 스타일 정의
const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
`;

const Video = styled.video`
  width: 45%;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: black;
`;

const OpenViduSession = ({ token }) => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.room.session);
  const subscribers = useSelector((state) => state.room.subscribers);
  const videoRef = useRef(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        console.log("OpenViduSession: Initializing session");
        const OV = new OpenVidu();
        const session = OV.initSession();

        session.on("streamCreated", (event) => {
          console.log("OpenViduSession: Stream created", event);
          const subscriber = session.subscribe(event.stream, undefined);
          dispatch(addSubscriber(subscriber));
        });

        await session.connect(token, {});
        console.log("OpenViduSession: Session connected");

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
        console.log("OpenViduSession: Publisher initialized and published");

        dispatch(setSession(session));
        dispatch(setPublisher(publisher));
      } catch (error) {
        console.error("OpenViduSession: Error initializing session", error);
      }
    };

    if (!session) {
      initSession();
    }

    return () => {
      if (session) {
        console.log("OpenViduSession: Disconnecting session");
        session.disconnect();
        dispatch(clearSession());
      }
    };
  }, [token, session, dispatch]);

  return (
    <VideoContainer>
      <Video ref={videoRef} autoPlay muted />
      {subscribers.map((sub, index) => (
        <Video
          key={index}
          ref={(el) => {
            if (el) sub.addVideoElement(el);
          }}
          autoPlay
        />
      ))}
    </VideoContainer>
  );
};

export default OpenViduSession;
