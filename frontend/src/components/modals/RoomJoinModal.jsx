import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import roomSlice, { setRoomId, setTeamCode } from "../../store/roomSlice";
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
  const [sessionInfo, setSessionInfo] = useState({});
  const [stClient, setStClient] = useState(null);

  useEffect(() => {
    //소켓 방생성
  });

  const handleJoinRoom = async () => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    const client = Stomp.over(socket);
    client.debug = (str) => {
      console.log("STOMP DEBUG:", str);
    };

    dispatch(setStompClient(client));
    try {
      const response = await axiosInstance.post(`/api/v1/room/${inviteCode}`, {
        groupCode: inviteCode,
      });
      console.log("오픈비두 방 참가 응답 : ", response.data.data);

      dispatch(setMemberId(response.data.data.memberId));
      dispatch(setOpenViduToken(response.data.data.openviduToken));
      dispatch(setRoomId(inviteCode));
      console.log("memberID : ", response.data.data.memberId);
      console.log("viduToken : ", response.data.data.openviduToken);
      console.log("Invite Code:", inviteCode);
      console.log("---------------------------------");
      //----------------------------------------------------------------------------------
      client.connect(
        {},
        (frame) => {
          console.log("웹소켓 서버와 연결됨!", frame);

          async function executeSequence() {
            if (client.connected) {
              await new Promise((resolve, reject) => {
                client.subscribe(`/topic/game/${inviteCode}`, (message) => {
                  const parsedMessage = JSON.parse(message.body);
                  console.log("방에서 받은 메시지:", parsedMessage);
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    parsedMessage,
                  ]);
                  resolve();
                });
              });

              // 각 memberId에 대한 구독
              console.log(response.data.data.memberId);

              await new Promise((resolve, reject) => {
                client.subscribe(
                  `/topic/game/${inviteCode}/${response.data.data.memberId}`,
                  (message) => {
                    const parsedMessage = JSON.parse(message.body);
                    console.log("개별 구독 받은 메시지:", parsedMessage);
                    // 응답 메시지에서 num 저장
                    if (
                      parsedMessage.data &&
                      parsedMessage.data.num !== undefined
                    ) {
                      dispatch(setUserNo(parsedMessage.data.num));
                      setSessionInfo((prevSessionInfo) => ({
                        ...prevSessionInfo,
                        num: parsedMessage.data.num,
                      }));
                    }
                    resolve();
                  }
                );
              });

              // 방 참가 요청 - 방 생성이 완료된 이후에나 시도해야 응답받음
              console.log("방 참가 요청:");
              await new Promise((resolve, reject) => {
                client.send(
                  `/app/game/${inviteCode}/${response.data.data.memberId}/join`,
                  {},
                  (response) => {
                    resolve();
                  }
                );
              });
            }
          }

          // 실행
          executeSequence()
            .then(() => {
              console.log("모든 작업이 순차적으로 완료되었습니다.");
            })
            .catch((error) => {
              console.error("작업 중 오류 발생:", error);
            });
          //==========================================================================
          // //roomId를 소켓 엔드포인트로 연결하면서 보냄
          // stClient.subscribe(`/game/${inviteCode}/join`, (message) => {
          //   console.log(
          //     `/game/${inviteCode}/join 에서 온 메세지 : `,
          //     message.body
          //   );
          // });

          // // 각 memberId에 대한 구독
          // stClient.subscribe(
          //   `/topic/game/${inviteCode}/${response.data.data.memberId}`,
          //   (message) => {
          //     const parsedMessage = JSON.parse(message.body);
          //     console.log("개별 구독 받은 메시지:", parsedMessage);
          //     // 응답 메시지에서 num 저장
          //     if (parsedMessage.data && parsedMessage.data.num !== undefined) {
          //       dispatch(setUserNo(parsedMessage.data.num));
          //     }
          //   }
          // );
          // //방 참여 요청
          // stClient.send(`/app/game/${inviteCode}/join`, (message) => {
          //   const parsedMessage = JSON.parse(message.body);
          //   console.log("방에서 받은 메시지:", parsedMessage);
          //   setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          // });

          // // 방에 대한 구독
          // stClient.subscribe(`/topic/game/${inviteCode}`, (message) => {
          //   const parsedMessage = JSON.parse(message.body);
          //   console.log("방에서 받은 메시지:", parsedMessage);
          //   setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          // });

          // // roomId를 소켓 엔드포인트로 연결하면서 보냄
          // stClient.subscribe(`/game/${inviteCode}/join`, (message) => {
          //   console.log(
          //     `/game/${inviteCode}/join 에서 온 메세지 : `,
          //     message.body
          //   );
          // });

          // stClient.onStompError = (frame) => {
          //   console.error("Broker reported error: " + frame.headers["message"]);
          //   console.error("Additional details: " + frame.body);
          // };
        },
        (error) => {
          console.error("STOMP error:", error);
        }
      );

      // client.activate();
      console.log("STOMP Client activated");

      // 로그인 여부를 state에 포함시켜 navigate
      // navigate("/user/profilePick", {
      //   state: {
      //     inviteCode,
      //     isJoin: true,
      //     isLoggedIn: isLoggedIn,
      //     from: "joinModal",
      //   },
      // });
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
