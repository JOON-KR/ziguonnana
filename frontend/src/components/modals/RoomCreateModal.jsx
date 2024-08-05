import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId, setTeamCode } from "../../store/roomSlice";
import authSlice from "../../store/authSlice";
import BASE_URL from "../../api/APIconfig";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
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

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  width: 50px;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => (props.selected ? "#ffffff" : "#54595e")};
  background-color: ${(props) => (props.selected ? "#58FFF5" : "#d4d7d9")};
  border: 1px solid #ccc;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
`;

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
`;

const RoomCreateModal = ({ onClose }) => {
  const [teamName, setTeamName] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState(1);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  const handleToggleClick = (capacity) => {
    setSelectedCapacity(capacity);
  };

  useEffect(() => {
    console.log("로그인 상태 : ", isLoggedIn);
    console.log("토큰 : ", token);
  }, [isLoggedIn, token]);

  const handleCreateRoom = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/room", {
        teamName: teamName,
        people: selectedCapacity,
      });

      const roomId = response.data.data.roomId;
      const teamCode = response.data.data.teamCode;

      console.log("roomID : ", roomId);
      console.log("teamCode : ", teamCode);

      dispatch(setRoomId(roomId));
      dispatch(setTeamCode(teamCode));

      const socket = new SockJS(`${BASE_URL}/ws`);
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => {
          console.log(str);
        },
      });

      stompClient.onConnect = () => {
        const serverUrl = socket._transport.url;
        console.log("서버 연결됨 : ", serverUrl);

        // 응답을 받을 주제 구독
        stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
          console.log(
            `/app/game/${roomId}/response 에서 온 메세지 : `,
            message.body
          );
          const response = JSON.parse(message.body);
          // 응답 처리 로직 추가
          console.log(response);
        });

        // 메시지 발행
        stompClient.publish(
          `/app/game/${roomId}/create`,
          {}, // 헤더가 필요 없는 경우 빈 객체
          JSON.stringify({
            people: selectedCapacity,
            teamName: teamName,
            message: "create Request",
          })
        );
      };

      stompClient.onStompError = (frame) => {
        console.error("Stomp 에러", frame.headers["message"], frame.body);
      };

      stompClient.activate();

      dispatch(setStompClient(stompClient));

      navigate("/user/profilePick", {
        state: {
          teamName,
          people: selectedCapacity,
          isJoin: false,
          from: "createModal",
        },
      });
    } catch (error) {
      console.error("방 생성 오류", error);
    }
  };

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
        <Title>이글루를 만들어주세요!</Title>
        <InputWrapper>
          <InputField
            type="text"
            placeholder="이글루 이름을 입력해주세요."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <ToggleWrapper>
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <ToggleButton
                key={number}
                selected={selectedCapacity === number}
                onClick={() => handleToggleClick(number)}
              >
                {number}
              </ToggleButton>
            ))}
          </ToggleWrapper>
        </InputWrapper>
        <BtnWrap>
          <GrayBtn text="취소" BtnFn={onClose} />
          <AquaBtn text="생성" BtnFn={handleCreateRoom} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default RoomCreateModal;
