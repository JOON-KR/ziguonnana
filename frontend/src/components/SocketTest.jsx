import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import roomSlice, {
  setMaxNo,
  setRoomId,
  setTeamCode,
} from "../../store/roomSlice";
import authSlice, {
  setMemberId,
  setOpenViduToken,
  setUserNo,
} from "../../store/authSlice";
import SockJS from "sockjs-client";
import BASE_URL from "../../api/APIconfig";
import { setStompClient } from "../../store/clientSlice";
import { Stomp } from "@stomp/stompjs";

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
  const [stClient, setStClient] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({});

  const memberId = useSelector((state) => state.auth.memberId);
  const [memId, setMemId] = useState("");

  const handleJoinRoom = async () => {
    try {
      //소켓 방생성
      const socket = new SockJS(`${BASE_URL}/ws`);
      const client = Stomp.over(socket);
      dispatch(setStompClient(client));

      const response = await axiosInstance.post(`/api/v1/room/${inviteCode}`, {
        groupCode: inviteCode,
      });

      console.log("오픈비두 방 참가 응답 : ", response.data.data);

      console.log("memberID : ", response.data.data.memberId);
      console.log("viduToken : ", response.data.data.openviduToken);
      console.log("Invite Code:", inviteCode);

      dispatch(setMemberId(response.data.data.memberId));
      dispatch(setOpenViduToken(response.data.data.openviduToken));
      dispatch(setRoomId(inviteCode));

      client.connect(
        {},
        (frame) => {
          console.log("웹소켓 서버와 연결됨!", frame);

          // 각 memberId에 대한 구독
          client.subscribe(
            `/topic/game/${inviteCode}/${memberId}`,
            (message) => {
              const parsedMessage = JSON.parse(message.body);
              console.log("개별 구독 :", parsedMessage);

              dispatch(setUserNo(parsedMessage.data.num));
              console.log("유저 번호 : ", parsedMessage.data.num);
              // 응답 메시지에서 num 저장
              if (parsedMessage.data && parsedMessage.data.num !== undefined) {
                setSessionInfo((prevSessionInfo) => ({
                  ...prevSessionInfo,
                  num: parsedMessage.data.num,
                }));
              }
            }
          );

          // 방에 대한 구독
          client.subscribe(`/topic/game/${inviteCode}`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            console.log("방 구독 :", parsedMessage);
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          });

          //roomId를 소켓 엔드포인트로 연결하면서 보냄
          client.subscribe(`/game/${inviteCode}/join`, (message) => {
            console.log(
              `/game/${inviteCode}/join 에서 온 메세지 : `,
              message.body
            );
          });

          //방소켓 입장 요청
          if (client && client.connected) {
            console.log("방 참가 요청:");
            client.send(`/app/game/${inviteCode}/join`, {}, JSON.stringify({}));
          }

          if (client && client.connected) {
            // 방에 대한 구독
            client.subscribe(`/topic/game/${inviteCode}`, (message) => {
              const parsedMessage = JSON.parse(message.body);
              console.log("방에서 받은 메시지:", parsedMessage);
              setMessages((prevMessages) => [...prevMessages, parsedMessage]);
            });
          }

          client.subscribe(`/app/game/${inviteCode}/join`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            console.log("방에서 받은 메시지:", parsedMessage);
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          });

          setStClient(client);
        },
        (error) => {
          console.error("STOMP error:", error);
        }
      );

      stClient.activate();
      // console.log("STOMP Client activated");

      // 로그인 여부를 state에 포함시켜 navigate
      // navigate("/user/profilePick", {
      //   state: {
      //     inviteCode,
      //     isJoin: true,
      //     isLoggedIn: isLoggedIn,
      //     from: "joinModal",
      //   },
      // });

      stClient.onStompError = (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };

      stClient.activate();
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
