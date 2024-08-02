import React from "react";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import profileImage1 from "../../assets/icons/p1.PNG";
import profileImage2 from "../../assets/icons/p2.PNG";
import newProfileImage from "../../assets/icons/newProfile.PNG";
import ProfileRegisterModal from "../../components/modals/ProfileRegisterModal";
import OpenViduComponent from "../../components/OpenViduComponent";
import { getProfileList, createProfile } from "../../api/profile/profileAPI";
import BASE_URL from "../../api/APIconfig";

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ProfilesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
`;

const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 40px;
`;

const SubTitle = styled.h3`
  font-size: 36px;
  color: white;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-top: 15px;
  cursor: pointer;
`;

const Tags = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const Tag = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: white;
  font-weight: bold;
`;

const Header = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  justify-content: flex-end;
  padding: 20px;
  margin-right: 30px;
`;

const HeaderText = styled.h4`
  font-size: 20px;
  padding: 0 20px;
  color: white;
  cursor: pointer;
`;

const ProfilePick = () => {
  const location = useLocation();
  const { teamName, people, roomId, isJoin } = location.state || {};
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isProfileRegisterModalOpen, setIsProfileRegisterModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [gameProfile, setGameProfile] = useState(null);

  //웹소켓 연결  
  useEffect(() => {
    const socket = new SockJS(`https://i11b303.p.ssafy.io/ws`);
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      setStatusMessage('웹소켓 서버와 연결됨!');
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        console.log('받은 메시지:', message.body);
        setMessages((prevMessages) => [...prevMessages, message.body]);
      });

      // sessionInfo 받아서 memberId 저장
      client.subscribe(`/user/queue/session`, (message) => {
        const sessionInfo = JSON.parse(message.body);
        localStorage.setItem('memberId', sessionInfo.memberId);
      });

      setStompClient(client);
    }, (error) => {
      setStatusMessage('웹소켓 서버와 연결 끊김!');
      console.error('STOMP error:', error);
    });

    return () => {
      if (client) {
        client.disconnect(() => {
          setStatusMessage('웹소켓 서버와 연결 끊김!');
        });
      }
    };
  }, [roomId]);

  // 디버그용 로그
  useEffect(() => {
    console.log('Location State:', location.state);
    console.log('Team Name:', teamName);
    console.log('People:', people);
    console.log('Room ID:', roomId);
    console.log('Is Join:', isJoin);
  }, [location.state, teamName, people, roomId, isJoin]);

  // 로그인 유저의 프로필 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profileList = await getProfileList();
        setProfiles(profileList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    const token = localStorage.getItem('accessToken');
    if (token) { //토큰이 있으면 가져옴
      fetchProfiles();
    } else {
      setLoading(false);
    }
  }, []);

  const pickProfile = (profile) => {
    setGameProfile(profile);
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/game/${roomId}/profile`, {}, JSON.stringify(profile));
    }

  };

  const closeProfileRegisterModal = () => {
    setIsProfileRegisterModalOpen(false);
  };


   const handleRegisterProfile = async (profileData) => {

    try {
      const request = await createProfile(profileData);
      setGameProfile(request);
      setIsProfileRegisterModalOpen(false);
      if (stompClient && stompClient.connected) {
        stompClient.send(`/app/game/${roomId}/profile`, {}, JSON.stringify(request));
      }
    } catch (error) {
      console.error("프로필 등록 실패:", error);
    }
  };

  return (
    <Wrap>
      {isProfileRegisterModalOpen && (
        <ProfileRegisterModal onClose={closeProfileRegisterModal} onRegisterProfile={handleRegisterProfile} />
      )}
      <Header>
        <HeaderText>마이페이지</HeaderText>
        <HeaderText>커뮤니티</HeaderText>
      </Header>
      <SubTitle>
        사용할 <span style={{ color: "#00FFFF" }}>프로필</span>을 골라주세요
      </SubTitle>
      <ProfilesContainer>
        {profiles.map((profile, index) => (
          <ProfileWrap key={index}>
            <Image src={profile.profileImage || profileImage1} alt="Profile Image" onClick={() => pickProfile(profile)} />
            <Tags>
              {profile.feature.split(', ').map((tag, idx) => (
                <Tag key={idx}>#{tag}</Tag>
              ))}
            </Tags>
          </ProfileWrap>
        ))}
        <ProfileWrap>
          <Image src={newProfileImage} alt="Profile Image" onClick={() => setIsProfileRegisterModalOpen(true)} />
          <Tags>
            {["새로운", "프로필", "만들기"].map((tag, idx) => (
              <Tag key={idx}>#{tag}</Tag>
            ))}
          </Tags>
        </ProfileWrap>
      </ProfilesContainer>
      {token && roomId && <OpenViduComponent token={token} roomId={roomId} />}
    </Wrap>
  );
};

export default ProfilePick;
