import React, { useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import { useDispatch, useSelector } from "react-redux";
import {
  setSession,
  setPublisher,
  addSubscriber,
  clearSession,
} from "../store/roomSlice";
import styled from "styled-components";

const VideoContainer = styled.div`
  display: none;
`;

const OpenViduSession = ({ token }) => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.room.session);
  const videoRef = useRef(null);

  useEffect(() => {
    const initSession = async () => {
      console.log("Initializing OpenVidu session");
      const OV = new OpenVidu();
      const session = OV.initSession();

      session.on("streamCreated", (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        dispatch(addSubscriber(subscriber));
        console.log("Stream created and subscriber added");
      });

      await session.connect(token, {});
      console.log("Session connected with token:", token);

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
      console.log("Publisher initialized and published");

      dispatch(setSession(session));
      dispatch(setPublisher(publisher));
    };

    if (!session) {
      initSession();
    }

    return () => {
      if (session) {
        session.disconnect();
        dispatch(clearSession());
      }
    };
  }, [token, session, dispatch]);

  return <VideoContainer ref={videoRef} autoPlay muted />;
};

export default OpenViduSession;
