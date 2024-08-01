import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import profileImage1 from "../../assets/icons/p1.PNG";
import profileImage2 from "../../assets/icons/p2.PNG";
import newProfileImage from "../../assets/icons/newProfile.PNG";
import ProfileRegisterModal from "../../components/modals/ProfileRegisterModal";
import OpenViduComponent from "../../components/OpenViduComponent";
import axiosInstance from "../../api/axiosInstance";

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
  const { teamName, people, roomId, inviteCode, isJoin } = location.state || {};
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setRoomId] = useState(null);
  const [isProfileRegisterModalOpen, setIsProfileRegisterModalOpen] = useState(false);

  // 로컬 스토리지에서 토큰 가져오기
  const localToken = localStorage.getItem('token');

  // 로그인된 상태에서 프로필 데이터를 가져오는 useEffect
  useEffect(() => {
    if (localToken) {
      const fetchProfiles = async () => {
        try {
          const headers = {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localToken}`
          };
          const res = await axiosInstance.get(`/api/v1/profile`, { headers });
          setProfiles(res.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfiles();
    } else {
      setLoading(false);
    }
  }, [localToken]);

  // WebSocket 연결을 통해 roomId 및 memberId 가져오기
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('https://i11b303.p.ssafy.io/ws');

      ws.onopen = () => {
        console.log('WebSocket Connected');
        const message = {
          type: isJoin ? 'JOIN' : 'CREATE',
          roomId: roomId,
          profile: { teamName, people }
        };
        const destination = isJoin ? `/app/game/${roomId}/join` : `/app/game/${roomId}/create`;
        ws.send(JSON.stringify({ destination, message }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'ROOM_ID') {
          setRoomId(data.roomId);
        }
        if (data.type === 'MEMBER_ID') {
          console.log('Member ID:', data.memberId);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
      };

      return () => {
        ws.close();
      };
    };

    if (roomId) { 
      connectWebSocket();
    }
  }, [roomId, inviteCode, isJoin]);

  const pickProfile = () => {
    // 프로필 클릭 시, 프로필 선택되게 하는 로직
  };

  const closeProfileRegisterModal = () => {
    setIsProfileRegisterModalOpen(false);
  };

  const myProfiles = [
    {
      imgSrc: profileImage1,
      tags: ["활발한", "아저씨", "하트"],
    },
    {
      imgSrc: profileImage2,
      tags: ["행복한", "소녀", "하트"],
    },
  ];

  return (
    <div>
      <Wrap>
        {isProfileRegisterModalOpen && (
          <ProfileRegisterModal onClose={closeProfileRegisterModal} />
        )}
        <Header>
          <HeaderText>마이페이지</HeaderText>
          <HeaderText>커뮤니티</HeaderText>
        </Header>
        <SubTitle>
          사용할 <span style={{ color: "#00FFFF" }}>프로필</span>을 골라주세요
        </SubTitle>
        <ProfilesContainer>
          {localToken && profiles.length > 0 ? (
            profiles.map((profile, index) => (
              <ProfileWrap key={index}>
                <Image src={profile.imgSrc} alt="Profile Image" onClick={pickProfile} />
                <Tags>
                  {profile.tags.map((tag, idx) => (
                    <Tag key={idx}>#{tag}</Tag>
                  ))}
                </Tags>
              </ProfileWrap>
            ))
          ) : (
            myProfiles.map((profile, index) => (
              <ProfileWrap key={index}>
                <Image src={profile.imgSrc} alt="Profile Image" onClick={pickProfile} />
                <Tags>
                  {profile.tags.map((tag, idx) => (
                    <Tag key={idx}>#{tag}</Tag>
                  ))}
                </Tags>
              </ProfileWrap>
            ))
          )}
          <ProfileWrap>
            <Image src={newProfileImage} alt="Profile Image" onClick={() => setIsProfileRegisterModalOpen(true)} />
            <Tags>
              {["새로운", "프로필", "만들기"].map((tag, idx) => (
                <Tag key={idx}>#{tag}</Tag>
              ))}
            </Tags>
          </ProfileWrap>
        </ProfilesContainer>
      </Wrap>
      {roomId && <OpenViduComponent roomId={roomId} />}
    </div>
  );
};

export default ProfilePick;
