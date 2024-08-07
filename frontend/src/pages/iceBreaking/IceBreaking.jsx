import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OpenViduSession from "../../components/OpenViduSession";
import VideoBox from "../../components/layout/VideoBox";
import { clearSession } from "../../store/roomSlice";

// Styled components
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
  flex-direction: column;
  position: relative;
`;

const ChatWrap = styled.div`
  /* width: 60%; */
  position: fixed;
  bottom: 30px;
`;

const IceBreaking = () => {
  const dispatch = useDispatch();
  const openviduToken = useSelector((state) => state.auth.openViduToken);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const [typedText, setTypedText] = useState("");
  // 컴포넌트 언마운트 시 세션 초기화
  useEffect(() => {
    return () => {
      dispatch(clearSession());
    };
  }, [dispatch]);

  // const sendMessage = () => {
  //   if (client && client.connected) {
  //     console.log("보내는 메시지:", {
  //       // sender: profile.name,
  //       content: typedText,
  //     });
  //     client.send(
  //       `/app/game/${roomId}/chat`,
  //       {},
  //       JSON.stringify({
  //         // sender: profile.name,
  //         content: typedText,
  //       })
  //     );
  //     setTypedText("");
  //   }
  // };

  return (
    <PageWrap>
      {/* OpenViduSession 컴포넌트 렌더링 */}
      {openviduToken && <OpenViduSession token={openviduToken} />}
      {/* VideoBox 컴포넌트 렌더링 */}
      <Frame>
        <VideoBox index={0} />
        <VideoBox index={1} />
        <VideoBox index={2} />
      </Frame>
      <Content>
        <Outlet />
        {/* <ChatWrap>
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage}>보냄</button>
        </ChatWrap> */}
      </Content>
      <Frame>
        <VideoBox index={3} />
        <VideoBox index={4} />
        <VideoBox index={5} />
      </Frame>
    </PageWrap>
  );
};

export default IceBreaking;
