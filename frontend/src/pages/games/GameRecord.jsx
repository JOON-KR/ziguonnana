import React, { useState, useEffect, useRef } from "react";
import { resolvePath, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";
import cardPic from "../../assets/images/profileCard.png";
import leftIcon from "../../assets/icons/left.png";
import rightIcon from "../../assets/icons/right.png";
import recordIcon from "../../assets/icons/record.png";
import recordBtn from "../../assets/icons/aqua_btn.png";
import gameRecordIcon from "../../assets/icons/game_record.png";
import AvatarCard from "../../components/avatarCard/AvatarCard";
import axios from "axios";
import avatarImg from "../../assets/icons/avartar.png"
import homeIcon from "../../assets/icons/home.png"; 
import BASEURL from "../../api/APIconfig";

const PageWrap = styled.div`
   display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100vh;  /* 뷰포트 높이에 맞추기 */
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const HomeIcon = styled.img`
  position: absolute;
  left: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const RecordHeader = styled.h1`
  font-size: 45px;
  color: #58fff5;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;


const SectionContainer1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // width: 80%;
  // height: 80vh;
`;

const SectionContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 85%;
  // height: 80vh;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  margin-right: 10px;
  color: white;
`;

const AvatarCardSection = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  padding: 15px;
  margin-left: 50px;
  margin-bottom: 20px;
  // margin: 10px 10px 30px 10px;
  color: white;
`;

const RecordSection = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  color: white;
`;

const GameSection = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(255, 255, 255, 0.1); */
  border-radius: 15px;
  padding: 10px;
  color: white;
`;

const Slide = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 12px;
`;

const RecordTitle = styled.h2`
  font-size: 28px;
  margin: 10px;
`;

const CardImage = styled.img`
  height: 150px;
  margin: 0 20px;
`;

const IconImage = styled.img`
  height: 50px;
  margin: 8px;
`;

const RecordIconImage = styled.img`
  height: 36px;
  margin: 15px;
`;

const GameRecordIconImage = styled.img`
  height: 36px;
  margin: 5px;
`;

const Text = styled.p`
  font-size: 20px;
  flex: 1;
  text-align: left;
  font-weight: bold;
  color: #58fff5;
`;

const ModalImage = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
`;


const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
`;

const ButtonText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  pointer-events: none; // 버튼 텍스트가 클릭되지 않도록 설정
  margin-bottom: 10px;
`;

  const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const InputField = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const ModalButton = styled.button`
  width: 30%;
  padding: 10px;
  background-color: #58fff5;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #45c9c1;
  }
`;

const StyledVideo = styled.video`
  width: 90%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

// 버튼 랩퍼 스타일 컴포넌트
const BtnWrap = styled.div`
  display: flex;
  gap: 51px;
  z-index: 2;
  gap: 20px;
`;

// 기본 버튼 스타일 컴포넌트
const Btn = styled.button`
  background-color: #58fff5;
  font-size: 20px;
  color: black;
  width: 200px;
  height: 68px;
  border-radius: 34px;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

// 검정 버튼 스타일 컴포넌트 (Btn 상속)
const BlackBtn = styled(Btn)`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 2px solid white;
`;


const GameRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = useSelector((state) => state.room.roomId);
  const userNo = useSelector((state) => state.auth.userNo);
  const client = useSelector((state) => state.client.stompClient);
  const maxNo = useSelector((state) => state.room.maxNo);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [meetingImageUrl, setMeetingImageUrl] = useState("");

  const { teamName, bodyCount, bodyDuration, igudongseongCount, people, poseBest, shortsURL, avatarCards } = location.state;

  useEffect(() => {
    console.log("전달된 데이터:", location.state);
  }, [location.state]);
  
  useEffect(() => {
    if (client && client.connected) {
      console.log("send:", `/app/game/${roomId}/meeting`);
      client.send(`/app/game/${roomId}/meeting`, {}, {});
    } else {
      console.warn("send 문제 발생");
    }
  }, [client, roomId]);
  
  const handlePicture = () => {
    if (client && client.connected) {
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);

        if (parsedMessage.commandType === "MEETING_IMAGE" && parsedMessage.message === "SUCCESS") {
          setMeetingImageUrl(parsedMessage.data);
          setShowImageModal(true);
          subscription.unsubscribe(); // 구독 해제
        }
      });
    }
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setMeetingImageUrl("");
  };

  const handleHomeClick = () => {
    navigate("/"); // 홈 아이콘 클릭 시 첫 번째 페이지로 이동
  };

  // 모달 열기
  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowUploadModal(false);
    setTitle("");
    setPassword("");
    setErrorMessage("");
  };

  // 업로드 버튼 클릭 시 호출
  const handleUploadSubmit = async () => {
    if (!title || !password) {
      setErrorMessage("제목과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASEURL}/api/v1/article/video`, {
        title,
        password,
        videoUrl: shortsURL,
      });

      console.log(response);

      if (response.status === 201) {
        alert("영상이 성공적으로 업로드되었습니다!");
        handleCloseModal();
        navigate("/user/community");
      }
    } catch (error) {
      console.error("업로드 중 오류 발생:", error);
      setErrorMessage("업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  //단체사진 저장
  const handleSaveImage = () => {
    const link = document.createElement("a");
    link.href = meetingImageUrl;
    link.download = "meeting_image.png";
    link.click();
  };

  return (
    <PageWrap>
      <HeaderContainer>
        <HomeIcon src={homeIcon} alt="Home" onClick={handleHomeClick} />
        <RecordHeader>이글루 기록</RecordHeader>
      </HeaderContainer>

      {/* 단체사진 모달 */}
      {showImageModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>단체 사진</ModalTitle>
            <ModalImage src={meetingImageUrl} alt="팀 단체 사진" />
            {/* <ModalButton onClick={handleSaveImage}>이미지 저장</ModalButton> */}
            <ModalButton onClick={handleCloseImageModal}>닫기</ModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}


      {/* 업로드 모달 */}
      {showUploadModal && (
        <ModalOverlay>  
          <ModalContainer>
            <ModalTitle>영상 업로드</ModalTitle>
            <InputField
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <StyledVideo>
                <source
                  src={shortsURL}
                  type="video/mp4"
                />
              </StyledVideo>
            <ModalButton onClick={handleUploadSubmit} disabled={loading}>
              {loading ? "업로드 중..." : "업로드"}
            </ModalButton>
            <ModalButton onClick={handleCloseModal}>취소</ModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}

      <SectionContainer2>
        <SectionContainer1>
          <Section>
            <Title>팀명</Title>
            <Text>{teamName}</Text>
          </Section>
          <Section>
            <Title>인원수</Title>
            <Text>{people}</Text>
          </Section>
        </SectionContainer1>

        <AvatarCardSection>
        {avatarCards.map((card, index) => (
              <AvatarCard
                key={index}
                avatarImage={card.avatarImage}
                nickname={card.nickname}
                features={card.features}
              />
            ))}
        </AvatarCardSection>
      </SectionContainer2>

      <RecordSection>
        <RecordTitle>베스트 포즈 🏅</RecordTitle>
        <GameSection>
          <Title>👉{poseBest}👈</Title>
        </GameSection>
      </RecordSection>

      <BtnWrap>
          <BlackBtn onClick={handlePicture}>
            단체 사진 보기
          </BlackBtn>
          <Btn onClick={handleUploadClick}>
            숏츠 업로드 하기
          </Btn>
        </BtnWrap>
    </PageWrap>
  );
};

export default GameRecord;