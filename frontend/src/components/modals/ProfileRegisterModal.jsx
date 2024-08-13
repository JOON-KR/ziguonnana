import React, { useState } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";
import GrayBtn from "../common/GrayBtn";
import ProfileNana from "../../assets/icons/ProfileNana.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNicknameList } from "../../store/nicknameSlice";

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
  margin-bottom: 24px;
  color: #54595e;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImageWrapper = styled.div`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  margin-right: 20px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageInput = styled.input`
  display: none;
`;

const NameWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #54595e;
`;

const Text = styled.p`
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #54595e;
`;

const InputField = styled.input`
  width: 250px;
  height: 48px;
  padding: 0 10px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #54595e;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  ::placeholder {
    color: #acacac; /* placeholder 글씨 색상 설정 */
  }
`;

const HashTagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LabelInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 입력 필드 사이 간격을 10px로 설정 */
`;

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px; /* 버튼 사이 간격 설정 */
`;

const ProfileRegisterModal = ({ onClose, onRegisterProfile }) => {
  const [profileImage, setProfileImage] = useState(ProfileNana);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [name, setName] = useState("");
  const [hashTag1, setHashTag1] = useState("");
  const [hashTag2, setHashTag2] = useState("");
  const [hashTag3, setHashTag3] = useState("");
  const userNo = useSelector((state) => state.auth.userNo);
  const memberId = useSelector((state) => state.auth.memberId);
  const openviduToken = useSelector((state) => state.auth.openViduToken);
  const roomId = useSelector((state) => state.room.roomId);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const client = useSelector((state) => state.client.stompClient);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nicknameList = useSelector((state) => state.nickname.nicknameList)


  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // 프로필 등록 핸들러
  const handleRegister = async () => {
    const profileData = {
      memberId: memberId,
      num: userNo,
      profileImageFile: "",
      feature: [hashTag1, hashTag2, hashTag3],
      name: name,
    };
    
    console.log("연결 상태 : ", client.connected);
    
    // client.subscribe(`/topic/game/${roomId}`, (message) => {
      //   const parsedMessage = JSON.parse(message.body);
      //   console.log("방에서 받은 메시지:", parsedMessage);
      //   if(parsedMessage.data == true)
      //   setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      // });
      
      // if (client && client.connected) {
        //   console.log("소켓에 전송할 데이터 : ", profileData);
        //   client.send(
          //     `/app/game/${roomId}/profile`,
          //     {},
          //     JSON.stringify(profileData)
          //   );
          // }
          
    // dispatch(setNicknameList(
    //   [...nicknameList, {"nickname": name, "num": userNo}]
    // ));
    // console.log("nicknameList: ",nicknameList)

    onRegisterProfile(profileData);

    //이거는 의도적으로 navigate state로 넘겼음. 건들지말것!
    navigate("/icebreaking", {
      state: {
        profileData,
      },
    });
  };

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
        <Title>👩‍🏫 프로필 정보를 입력해주세요.</Title>
        <ProfileWrapper>
          {/* <ProfileImageWrapper
            onClick={() => document.getElementById("imageInput").click()}
          >
            <ProfileImage src={profileImage} alt="Profile" />
            <ImageInput
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </ProfileImageWrapper> */}
          <NameWrapper>
            <Label>이름</Label>
            <InputField
              type="text"
              placeholder="이름을 입력해주세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </NameWrapper>
        </ProfileWrapper>
        <HashTagWrapper>
          <Text>
            자신을 나타낼 수 있는 키워드를 작성해주세요. <br />
            ex) mbti, 취미, 닮은 연예인 등
          </Text>
          <LabelInputWrapper>
            <Label>해시태그1</Label>
            <InputField
              type="text"
              placeholder="첫번째 해시태그를 입력해주세요."
              value={hashTag1}
              onChange={(e) => setHashTag1(e.target.value)}
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>해시태그2</Label>
            <InputField
              type="text"
              placeholder="두번째 해시태그를 입력해주세요."
              value={hashTag2}
              onChange={(e) => setHashTag2(e.target.value)}
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>해시태그3</Label>
            <InputField
              type="text"
              placeholder="세번째 해시태그를 입력해주세요."
              value={hashTag3}
              onChange={(e) => setHashTag3(e.target.value)}
            />
          </LabelInputWrapper>
        </HashTagWrapper>
        <BtnWrap>
          <GrayBtn text="취소" BtnFn={onClose} />
          <AquaBtn text="프로필 등록" BtnFn={handleRegister} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default ProfileRegisterModal;
