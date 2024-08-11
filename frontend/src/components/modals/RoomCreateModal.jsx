import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setMaxNo, setRoomId, setTeamCode } from "../../store/roomSlice";
import authSlice, {
  setMemberId,
  setOpenViduToken,
  setUserNo,
} from "../../store/authSlice";
import BASE_URL, { TAMTAM_URL } from "../../api/APIconfig";
import axios from "axios";
import SockJS from "sockjs-client";
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
  const [stClient, setStClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessionInfo, setSessionInfo] = useState({});

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  const handleToggleClick = (capacity) => {
    setSelectedCapacity(capacity);
    dispatch(setMaxNo(capacity));
  };

  useEffect(() => {
    // console.log("로그인 상태 : ", isLoggedIn);
    // console.log("토큰 : ", token);
  }, [isLoggedIn, token]);

  const handleCreateRoom = async () => {
    try {
      //오픈비두 방생성
      const response = await axiosInstance.post("/api/v1/room", {
        teamName: teamName,
        people: selectedCapacity,
      });
      // console.log("오픈비두 엔드포인트 응답 :"x, response.data.data);

      const roomId = response.data.data.roomId;
      console.log("roomID : ", roomId);
      dispatch(setRoomId(roomId));

      //오픈비두 방입장
      const enterResponse = await axiosInstance.post(`/api/v1/room/${roomId}`);
      console.log("오픈비두 방입장 응답 : ", enterResponse.data.data);

      const viduToken = enterResponse.data.data.openviduToken;
      const memberId = enterResponse.data.data.memberId;

      //전역상태 저장
      dispatch(setOpenViduToken(viduToken));
      dispatch(setMemberId(memberId));

      //소켓 방생성
      // const socket = new SockJS(`${BASE_URL}/ws`);
      const socket = new SockJS(`${TAMTAM_URL}/ws`);

      const client = Stomp.over(socket);
      dispatch(setStompClient(client));

      client.connect(
        {},
        (frame) => {
          // console.log("웹소켓 서버와 연결됨!", frame);

          if (client && client.connected) {
            // 방에 대한 구독
            client.subscribe(`/topic/game/${roomId}`, (message) => {
              const parsedMessage = JSON.parse(message.body);
              console.log("방에서 받은 메시지:", parsedMessage);
              setMessages((prevMessages) => [...prevMessages, parsedMessage]);
            });
          }

          if (client && client.connected) {
            // 각 memberId에 대한 구독
            client.subscribe(`/topic/game/${roomId}/${memberId}`, (message) => {
              const parsedMessage = JSON.parse(message.body);
              console.log("개별 구독 받은 메시지:", parsedMessage);

              dispatch(setUserNo(parsedMessage.data.num)); // 수정
              console.log("유저 번호 :", parsedMessage.data.num);

              // 응답 메시지에서 num 저장
              if (parsedMessage.data && parsedMessage.data.num !== undefined) {
                setSessionInfo((prevSessionInfo) => ({
                  ...prevSessionInfo,
                  num: parsedMessage.data.num,
                }));
              }
            });
          }

          //소켓 방 구독
          if (client && client.connected) {
            console.log("소켓 방 구독 요청:", {
              teamName,
              people: selectedCapacity,
            });
            client.subscribe(
              `/app/game/${roomId}/join`,
              {},
              JSON.stringify({})
            );
          }

          if (client && client.connected) {
            //방 생성 요청
            console.log("소켓 방 생성 요청:", {
              teamName,
              people: selectedCapacity,
            });
            console.log("설정한 방 인원 수 : ", selectedCapacity);
            client.send(
              `/app/game/${roomId}/create`,
              {},
              JSON.stringify({
                teamName,
                people: selectedCapacity, // 임의로 설정, 필요에 따라 변경
                memberId, // memberId 포함
              })
            );
          }
        },
        (error) => {
          console.error("STOMP error:", error);
        }
      );

      // 메시지 발행

      client.onStompError = (frame) => {
        console.error("Stomp 에러", frame.headers["message"], frame.body);
      };

      client.activate();

      dispatch(setStompClient(client));

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
