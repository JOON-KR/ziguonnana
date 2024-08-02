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
  const { teamName, people, roomId, isJoin } = location.state || {};
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isProfileRegisterModalOpen, setIsProfileRegisterModalOpen] = useState(false);

  // 디버그용 로그
  useEffect(() => {
    console.log('Location State:', location.state);
    console.log('Team Name:', teamName);
    console.log('People:', people);
    console.log('Room ID:', roomId);
    console.log('Is Join:', isJoin);
  }, [location.state, teamName, people, roomId, isJoin]);

  // 프로필 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setProfiles([
          { imgSrc: profileImage1, tags: ["활발한", "아저씨", "하트"] },
          { imgSrc: profileImage2, tags: ["행복한", "소녀", "하트"] }
        ]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // 토큰을 가져오는 useEffect
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axiosInstance.post(`/api/v1/room/${roomId}`, { groupCode: roomId }, { headers });
        setToken(response.data.data.token);
      } catch (error) {
        console.error('토큰 가져오기 오류', error);
      }
    };
    if (roomId) {
      fetchToken();
    }
  }, [roomId]);

  const pickProfile = () => {
    // 프로필 클릭 시, 프로필 선택되게 하는 로직
  };

  const closeProfileRegisterModal = () => {
    setIsProfileRegisterModalOpen(false);
  };

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
          {profiles.map((profile, index) => (
            <ProfileWrap key={index}>
              <Image src={profile.imgSrc} alt="Profile Image" onClick={pickProfile} />
              <Tags>
                {profile.tags.map((tag, idx) => (
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
      </Wrap>
      {token && roomId && <OpenViduComponent token={token} roomId={roomId} />}
    </div>
  );
};

export default ProfilePick;