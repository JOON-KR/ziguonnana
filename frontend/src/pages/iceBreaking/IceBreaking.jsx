import React from "react";
import styled from "styled-components";
import { Outlet, useLocation } from "react-router-dom";
import OpenViduSession from "../../components/OpenViduSession"; // 경로를 맞춰주세요
import VideoBox from "../../components/layout/VideoBox";

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  gap: 16px;
  width: 200px; /* Fixed width for Frame */
`;

const Content = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IceBreaking = () => {
  const location = useLocation();
  const { roomId, openviduToken, profileData } = location.state || {};

  console.log("IceBreaking: Room ID:", roomId);
  console.log("IceBreaking: OpenVidu Token:", openviduToken);
  console.log("IceBreaking: Profile Data:", profileData);

  return (
    <PageWrap>
      <Frame>
        <VideoBox />
        <VideoBox />
        <VideoBox />
      </Frame>
      <Content>
        {/* 하위 페이지는 Outlet위치에 박힘(사람 6개는 고정) */}
        <Outlet />
      </Content>
      <Frame>
        <VideoBox />
        <VideoBox />
        <VideoBox />
      </Frame>
    </PageWrap>
  );
};

export default IceBreaking;
