import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import profileImage1 from "../../assets/icons/p1.PNG";
import newProfileImage from "../../assets/icons/newProfile.PNG";
import ProfileRegisterModal from "../../components/modals/ProfileRegisterModal";
import OpenViduComponent from "../../components/OpenViduComponent";
import { getProfileList, createProfile } from "../../api/profile/profileAPI";
import { useWebSocket } from "../../context/WebSocketContext";
import BASE_URL from "../../api/APIconfig";

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

// 서브 타이틀 스타일 설정
const SubTitle = styled.h3`
  font-size: 36px;
  color: white;
`;

// 프로필 이미지 스타일 설정
const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-top: 15px;
  cursor: pointer;
`;

// 태그 리스트 스타일 설정
const Tags = styled.div`
  margin-top: 10px;
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

const ProfilePick = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamName, people, roomId, isJoin, loggedIn } = location.state || {};
  const [profiles, setProfiles] = useState([]);
  const [isProfileRegisterModalOpen, setIsProfileRegisterModalOpen] =
    useState(false);
  const [gameProfile, setGameProfile] = useState(null);
  const { connectWebSocket, stompClient } = useWebSocket();
  const hasMountedRef = useRef(false); // 마운트 상태를 추적하는 Ref

  // 웹소켓 연결 설정
  useEffect(() => {
    if (hasMountedRef.current) return; // 이미 마운트되었으면 재실행 방지
    hasMountedRef.current = true; // 첫 마운트 시 설정

    connectWebSocket(roomId);

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("웹소켓 연결 종료"); // 웹소켓 연결 종료 메시지
        });
      }
    };
  }, [connectWebSocket, roomId, stompClient]);

  // 로그인 유저의 프로필 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchProfiles = async () => {
      if (loggedIn) {
        try {
          const profileList = await getProfileList();
          setProfiles(profileList);
          console.log("프로필 리스트 불러오기 성공:", profileList); // 프로필 리스트 성공 메시지
        } catch (error) {
          console.error("프로필 불러오기 실패:", error); // 프로필 리스트 실패 메시지
        }
      }
    };
    fetchProfiles();
  }, [loggedIn]);

  // 프로필을 선택하여 소켓으로 전송하는 함수
  const pickProfile = (profile) => {
    setGameProfile(profile);
    if (stompClient && stompClient.connected) {
      stompClient.send(
        `/app/game/${roomId}/profile`,
        {},
        JSON.stringify({ ...profile, roomId })
      );
      console.log("프로필 정보 전송:", profile); // 프로필 정보 전송 메시지
    }
    navigate("/icebreaking", { state: { roomId } });
  };

  // 모달 닫기 함수
  const closeProfileRegisterModal = () => {
    setIsProfileRegisterModalOpen(false);
  };

  // 프로필 등록 핸들러
  const handleRegisterProfile = async (profileData) => {
    if (loggedIn) {
      try {
        const profile = await createProfile(profileData);
        setProfiles((prevProfiles) => [...prevProfiles, profile]); // 프로필 리스트 업데이트
        setGameProfile(profile);
        setIsProfileRegisterModalOpen(false);
        if (stompClient && stompClient.connected) {
          stompClient.send(
            `/app/game/${roomId}/profile`,
            {},
            JSON.stringify({ ...profile, roomId })
          );
          console.log("프로필 정보 전송:", profile); // 프로필 정보 전송 메시지
        }
      } catch (error) {
        console.error("프로필 등록 실패:", error); // 프로필 등록 실패 메시지
      }
    } else {
      setGameProfile(profileData);
      setProfiles((prevProfiles) => [...prevProfiles, profileData]); // 프로필 리스트 업데이트
      setIsProfileRegisterModalOpen(false);
      if (stompClient && stompClient.connected) {
        stompClient.send(
          `/app/game/${roomId}/profile`,
          {},
          JSON.stringify({ ...profileData, roomId })
        );
        console.log("프로필 정보 전송:", profileData); // 프로필 정보 전송 메시지
      }
      navigate("/icebreaking", { state: { roomId } });
    }
  };

  return (
    <Wrap>
      {/* 프로필 등록 모달이 열려 있는 경우에만 모달을 렌더링합니다. */}
      {isProfileRegisterModalOpen && (
        <ProfileRegisterModal
          onClose={closeProfileRegisterModal} // 모달 닫기 함수
          onRegisterProfile={handleRegisterProfile} // 프로필 등록 핸들러
        />
      )}

      {/* 상단 헤더 부분 */}
      <Header>
        <HeaderText>마이페이지</HeaderText>
        <HeaderText>커뮤니티</HeaderText>
      </Header>

      {/* 서브 타이틀 */}
      <SubTitle>
        사용할 <span style={{ color: "#00FFFF" }}>프로필</span>을 골라주세요
      </SubTitle>

      {/* 프로필 리스트 컨테이너 */}
      <ProfilesContainer>
        {/* 로그인된 유저만 프로필 목록을 볼 수 있습니다. */}
        {loggedIn &&
          profiles.map((profile, index) => (
            <ProfileWrap key={index}>
              <Image
                src={profile.profileImage || profileImage1} // 프로필 이미지
                alt="Profile Image"
                onClick={() => pickProfile(profile)} // 프로필 선택 핸들러
              />
              <Tags>
                {/* 프로필에 포함된 해시태그를 렌더링합니다. */}
                {profile.feature.map((tag, idx) => (
                  <Tag key={idx}>#{tag}</Tag>
                ))}
              </Tags>
            </ProfileWrap>
          ))}

        {/* 새로운 프로필을 만들기 위한 래퍼 */}
        <ProfileWrap>
          <Image
            src={newProfileImage} // 새로운 프로필 이미지
            alt="Profile Image"
            onClick={() => setIsProfileRegisterModalOpen(true)} // 모달 열기 함수
          />
          <Tags>
            {/* 새로운 프로필 만들기 해시태그 */}
            {["새로운", "프로필", "만들기"].map((tag, idx) => (
              <Tag key={idx}>#{tag}</Tag>
            ))}
          </Tags>
        </ProfileWrap>
      </ProfilesContainer>

      {/* OpenViduComponent 컴포넌트는 로그인된 유저와 roomId가 있을 때만 렌더링합니다. */}
      {loggedIn && roomId && (
        <OpenViduComponent
          token={localStorage.getItem("accessToken")} // 액세스 토큰을 전달
          roomId={roomId} // 방 ID를 전달
        />
      )}
    </Wrap>
  );
};

export default ProfilePick;
