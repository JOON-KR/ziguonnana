import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OpenViduSession from "../../components/OpenViduSession";
import VideoBox from "../../components/layout/VideoBox";
import { clearSession } from "../../store/roomSlice";

// Global style to reset body and html to avoid scrolling
const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden; /* Prevent scrolling */
  }
`;

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
  margin-left: 30px;
  margin-right: 30px;
  width: 200px; /* Fixed width for Frame */
`;

const Content = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const IceBreaking = () => {
  const dispatch = useDispatch();
  const openviduToken = useSelector((state) => state.auth.openViduToken);

  useEffect(() => {
    return () => {
      dispatch(clearSession());
    };
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />
      <PageWrap>
        {openviduToken && <OpenViduSession token={openviduToken} />}
        <Frame>
          <VideoBox index={0} />
          <VideoBox index={1} />
          <VideoBox index={2} />
        </Frame>
        <Content>
          <Outlet />
        </Content>
        <Frame>
          <VideoBox index={3} />
          <VideoBox index={4} />
          <VideoBox index={5} />
        </Frame>
      </PageWrap>
    </>
  );
};

export default IceBreaking;
