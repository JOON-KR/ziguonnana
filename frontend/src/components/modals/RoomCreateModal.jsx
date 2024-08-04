import React, { useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

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
  const navigate = useNavigate();

  const handleToggleClick = (capacity) => {
    setSelectedCapacity(capacity);
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/room", {
        teamName: teamName,
        people: selectedCapacity,
      });
      console.log("roomId:", response.data);
      const roomId = response.data.roomId;
      const token = localStorage.getItem("accessToken");

      // 로그인 여부를 state에 포함시켜 navigate
      navigate("/user/profilePick", {
        state: {
          teamName,
          people: selectedCapacity,
          roomId: roomId,
          isJoin: false,
          loggedIn: !!token,
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
