import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId, setTeamCode } from "../../store/roomSlice";
import {
  setMemberId,
  setOpenViduToken,
  setUserNo,
} from "../../store/authSlice";
import SockJS from "sockjs-client";
import { setStompClient } from "../../store/clientSlice";
import { Stomp } from "@stomp/stompjs";
import BASE_URL from "../../api/APIconfig";

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
  const [messages, setMessages] = useState([]);
  const [sessionInfo, setSessionInfo] = useState({});
  const [stClient, setStClient] = useState(null);
  const [memId, setMemId] = useState("");

  useEffect(() => {
    if (inviteCode !== "") {
      const socket = new SockJS(`${BASE_URL}/ws`);
      // const socket = new SockJS(`${TAMTAM_URL}/ws`);
      const client = Stomp.over(socket);

      client.connect(
        {},
        async (frame) => {
          console.log("웹소켓 서버와 연결됨!", frame);

          // 오픈비두 방 입장 처리
          const response = await axiosInstance.post(
            `/api/v1/room/${inviteCode}`
          );
          console.log("오픈비두 방 참가 응답 : ", response.data.data);

          const { memberId, openviduToken } = response.data.data;

          // 전역 상태 업데이트
          dispatch(setMemberId(memberId));
          dispatch(setOpenViduToken(openviduToken));
          dispatch(setRoomId(inviteCode));

          setMemId(memberId);

          // 방에 대한 구독
          client.subscribe(`/topic/game/${inviteCode}`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            console.log("방에서 받은 메시지:", parsedMessage);
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          });

          // 각 memberId에 대한 구독
          client.subscribe(
            `/topic/game/${inviteCode}/${memberId}`,
            (message) => {
              const parsedMessage = JSON.parse(message.body);
              console.log("개별 구독 받은 메시지:", parsedMessage);
              if (parsedMessage.data && parsedMessage.data.num !== undefined) {
                dispatch(setUserNo(parsedMessage.data.num));
                console.log("유저 번호 :", parsedMessage.data.num);
                setSessionInfo((prevSessionInfo) => ({
                  ...prevSessionInfo,
                  num: parsedMessage.data.num,
                }));
              }
            }
          );

          setStClient(client);
          dispatch(setStompClient(client));
        },
        (error) => {
          console.error("STOMP error:", error);
        }
      );
    }
  }, [inviteCode]);

  const handleJoinRoom = () => {
    if (stClient && stClient.connected) {
      console.log("방 참가 요청 :  ");
      stClient.send(`/app/game/${inviteCode}/${memId}/join`);
    }

    navigate("/user/profilePick", {
      state: {
        inviteCode,
        isJoin: true,
        isLoggedIn: isLoggedIn,
        from: "joinModal",
      },
    });
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
