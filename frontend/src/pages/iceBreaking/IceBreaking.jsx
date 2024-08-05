import React from "react";
import styled from "styled-components";
import VideoBox from "../../components/layout/VideoBox";
import Loader from "../../components/common/Loader";
import { Outlet } from "react-router-dom";

const PageWrap = styled.div`
  width: 100%;
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
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /* background-color: aliceblue; */
`;

const PageTemplate = () => {
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

export default PageTemplate;
