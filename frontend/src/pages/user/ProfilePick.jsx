import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import profileImage1 from "../../assets/icons/p1.PNG";
import newProfileImage from "../../assets/icons/newProfile.PNG";
import ProfileRegisterModal from "../../components/modals/ProfileRegisterModal";
import { getProfileList, createProfile } from "../../api/profile/profileAPI";
import BASE_URL, { TAMTAM_URL } from "../../api/APIconfig";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 전체 래퍼 스타일 설정
const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// 프로필 리스트 컨테이너 스타일 설정
const ProfilesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
`;

// 프로필 래퍼 스타일 설정
const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 40px;
`;

// 버튼 래퍼 스타일 설정
const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0 40px;
`;

// 서브 타이틀 스타일 설정
const SubTitle = styled.h3`
  font-size: 36px;
  color: white;
  margin-bottom: 20px;
`;

// 프로필 이미지 스타일 설정
const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  cursor: pointer;
`;

// 태그 리스트 스타일 설정
const Tags = styled.div`
  margin-top: 15px;
  text-align: center;
`;

// 개별 태그 스타일 설정
const Tag = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: white;
  font-weight: bold;
`;

// 헤더 스타일 설정
const Header = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  justify-content: flex-end;
  padding: 20px;
  margin-right: 30px;
`;

// 헤더 텍스트 스타일 설정
const HeaderText = styled.h4`
  font-size: 20px;
  padding: 0 20px;
  color: white;
  cursor: pointer;
`;

// 복사 버튼 스타일 설정
const CopyButton = styled.button`
  font-size: 16px;
  font-weight: bold;
  padding: 8px 12px;
  margin-left: 18px;
  margin-bottom: 14px;
  background-color: #00ffff;
  color: #54595e;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #00cccc;
  }
`;

const ProfilePick = () => {
  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [profiles, setProfiles] = useState([]);
  const [isProfileRegisterModalOpen, setIsProfileRegisterModalOpen] =
    useState(false);
  const [gameProfile, setGameProfile] = useState(null);

  const stompClientRef = useRef(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (isLoggedIn) {
        try {
          const profileList = await getProfileList();
          setProfiles(profileList);
          console.log("프로필 리스트 불러오기 성공:", profileList);
        } catch (error) {
          console.error("프로필 불러오기 실패:", error);
        }
      }
    };
    fetchProfiles();

    const socket = new SockJS(`${BASE_URL}/ws`);
    // const socket = new SockJS(`${TAMTAM_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClientRef.current = stompClient;

    stompClient.onConnect = (frame) => {
      const serverUrl = socket._transport.url;
      console.log("Connected to server: " + serverUrl);
      console.log("Connected: " + JSON.stringify(frame));
    };

    stompClient.activate();
  }, [isLoggedIn]);

  const closeProfileRegisterModal = () => {
    setIsProfileRegisterModalOpen(false);
  };

  const handleRegisterProfile = async (profileData) => {
    if (isLoggedIn) {
      try {
        const profile = await createProfile(profileData);
        setProfiles((prevProfiles) => [...prevProfiles, profile]);
        setGameProfile(profile);
        setIsProfileRegisterModalOpen(false);

        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.subscribe(
            `/app/game/${roomId}/profile`,
            {},
            JSON.stringify({ ...profile, roomId })
          );
          console.log("프로필 정보 전송:", profile);
        }
      } catch (error) {
        console.error("프로필 등록 실패:", error);
      }
    } else {
      setGameProfile(profileData);
      setProfiles((prevProfiles) => [...prevProfiles, profileData]);
      setIsProfileRegisterModalOpen(false);
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.subscribe(
          `/app/game/${roomId}/profile`,
          {},
          JSON.stringify({ ...profileData, roomId })
        );
        console.log("프로필 정보 전송:", profileData);
      }
    }

    // 프로필 등록 후 IceBreaking 페이지로 이동
    // navigate("/icebreaking", {
    //   state: {
    //     roomId,
    //     openviduToken,
    //     profileData,
    //   },
    // });
  };

  const handleCopyRoomId = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        alert("방 참여 코드가 복사되었습니다.");
      })
      .catch((err) => {
        console.error("방 참여 코드 복사 실패:", err);
      });
  };

  return (
    <Wrap>
      {isProfileRegisterModalOpen && (
        <ProfileRegisterModal
          onClose={closeProfileRegisterModal}
          onRegisterProfile={handleRegisterProfile}
        />
      )}

      {/* <Header>
        <HeaderText>커뮤니티</HeaderText>
      </Header> */}

      <SubTitle>
        사용할 <span style={{ color: "#00FFFF" }}>프로필</span>을 골라주세요
      </SubTitle>
      <ButtonWrap>
        <SubTitle>방 참여 코드 : {roomId}</SubTitle>
        <CopyButton onClick={handleCopyRoomId}>복사</CopyButton>
      </ButtonWrap>

      <ProfilesContainer>
        {isLoggedIn &&
          profiles.map((profile, index) => (
            <ProfileWrap key={index}>
              <Image
                src={profile.profileImage || profileImage1}
                alt="Profile Image"
                onClick={() => {}}
              />
              <Tags>
                {profile.feature.map((tag, idx) => (
                  <Tag key={idx}>#{tag}</Tag>
                ))}
              </Tags>
            </ProfileWrap>
          ))}

        <ProfileWrap>
          <Image
            src={newProfileImage}
            alt="Profile Image"
            onClick={() => {
              setIsProfileRegisterModalOpen(true);
              console.log("프로필 유저 번호 : ", userNo);
            }}
          />
          <Tags>
            {["새로운", "프로필", "만들기"].map((tag, idx) => (
              <Tag key={idx}>#{tag}</Tag>
            ))}
          </Tags>
        </ProfileWrap>
      </ProfilesContainer>
    </Wrap>
  );
};

export default ProfilePick;
