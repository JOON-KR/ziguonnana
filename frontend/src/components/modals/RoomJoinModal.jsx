import React, { useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId } from "../../store/roomSlice";
import SockJS from "sockjs-client";
import BASE_URL from "../../api/APIconfig";
import { Client } from "@stomp/stompjs";
import { setStompClient } from "../../store/clientSlice";

const BlackBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalWrap = styled.div`
  background-image: url(${GoogleModal});
  background-size: cover;
  background-position: center;
  width: 721px;
  height: 610px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 48px;
  color: #54595e;
`;

const InputWrapper = styled.div`
  width: 100%;
  max-width: 465px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  width: 374px;
  height: 48px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: bold;
  color: #54595e;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 20px;
  ::placeholder {
    color: #acacac;
  }
`;

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
`;

const RoomJoinModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleJoinRoom = async () => {
    try {
      const response = await axiosInstance.post(`/api/v1/room/${inviteCode}`, {
        groupCode: inviteCode,
      });

      console.log("오픈비두 엔드포인트 연결 : ", response);
      const openviduToken = response.data.data.openviduToken; // 수정된 부분: 응답에서 openviduToken 추출
      console.log("OpenVidu Token:", openviduToken);

      dispatch(setRoomId(inviteCode));

      // 소켓 생성
      const socket = new SockJS(`${BASE_URL}/ws`);
      console.log("Socket created");

      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => {
          console.log("STOMP Debug:", str);
        },
      });

      stompClient.onConnect = () => {
        const serverUrl = socket._transport.url;
        console.log("서버 연결됨 : ", serverUrl);

        // roomId를 소켓 엔드포인트로 연결하면서 보냄
        stompClient.subscribe(`/game/${inviteCode}/join`, (message) => {
          console.log(
            `/game/${inviteCode}/join 에서 온 메세지 : `,
            message.body
          );
        });

        console.log("Subscribing to destination");
        var destination = `/app/game/${inviteCode}/join`;

        stompClient.activate();
        console.log("STOMP Client activated");

        dispatch(setStompClient(stompClient));

        // 로그인 여부를 state에 포함시켜 navigate
        navigate("/user/profilePick", {
          state: {
            roomId: inviteCode,
            openviduToken,
            isJoin: true,
            isLoggedIn: isLoggedIn,
            from: "joinModal",
          },
        });
      };

      stompClient.onStompError = (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };

      stompClient.activate();
    } catch (e) {
      console.error("방참여 오류", e);
    }
  };

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
        <Title>이글루에 초대받으셨나요?</Title>
        <InputWrapper>
          <InputField
            type="password"
            placeholder="초대코드를 입력해주세요."
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </InputWrapper>
        <BtnWrap>
          <GrayBtn text="취소" BtnFn={onClose} />
          <AquaBtn text="입장" BtnFn={handleJoinRoom} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default RoomJoinModal;
