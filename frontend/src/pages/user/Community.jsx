import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import VideoModal from "../../components/modals/VideoModal";
import VideoCard from "../../components/layout/VideoCard";
import community_bg from "../../assets/images/community_bg.png";
import default_profile from "../../assets/images/default_profile.png"; // 기본 프로필 이미지
import MintBtn from "../../components/common/MintBtn";
import likeIcon from "../../assets/images/like_icon.png"; // 좋아요 아이콘 이미지 경로

// 페이지 전체를 감싸는 스타일 컴포넌트
const PageWrap = styled.div`
  background-image: url(${community_bg});
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
`;

// 콘텐츠를 감싸는 스타일 컴포넌트
const ContentWrapper = styled.div`
  width: calc(100% - 800px); /* 좌우 여백을 합쳐 800px을 제외한 너비 */
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  margin-top: 37px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  color: #58fff5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

// 프로필 이미지를 표시하는 스타일 컴포넌트
const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
`;

// 비디오 그리드를 감싸는 스타일 컴포넌트
const VideoGridContainer = styled.div`
  width: 660px;
  height: calc(100vh - 100px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3px;

  /* 스크롤바 숨기기 */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

// Community 컴포넌트 정의
const Community = () => {
  const [videos, setVideos] = useState([
    {
      id: 1,
      videos: [
        "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "https://media.w3.org/2010/05/bunny/trailer.mp4",
        "https://media.w3.org/2010/05/video/movie_300.mp4",
      ],
    },
    {
      id: 2,
      videos: [
        "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "https://media.w3.org/2010/05/bunny/trailer.mp4",
        "https://media.w3.org/2010/05/video/movie_300.mp4",
      ],
    },
    {
      id: 3,
      videos: [
        "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "https://media.w3.org/2010/05/bunny/trailer.mp4",
        "https://media.w3.org/2010/05/video/movie_300.mp4",
      ],
    },
    {
      id: 4,
      videos: [
        "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "https://media.w3.org/2010/05/bunny/trailer.mp4",
        "https://media.w3.org/2010/05/video/movie_300.mp4",
      ],
    },
    {
      id: 5,
      videos: [
        "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        "https://media.w3.org/2010/05/bunny/trailer.mp4",
        "https://media.w3.org/2010/05/video/movie_300.mp4",
      ],
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState(null); // 모달에서 재생할 비디오 URL
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [profileImage, setProfileImage] = useState(default_profile); // 프로필 이미지 상태 관리

  const { ref, inView } = useInView();

  const videoURLs = [
    "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4",
    "https://media.w3.org/2010/05/video/movie_300.mp4",
    "https://media.w3.org/2010/05/bunny/movie.mp4",
    "https://media.w3.org/2010/05/sintel/movie.mp4",
  ];

  const getRandomVideos = () => {
    return Array.from(
      { length: 3 },
      () => videoURLs[Math.floor(Math.random() * videoURLs.length)]
    );
  };

  const fetchMoreData = () => {
    setVideos((prevVideos) => [
      ...prevVideos,
      {
        id: prevVideos.length + 1,
        videos: getRandomVideos(),
      },
    ]);
  };

  useEffect(() => {
    if (inView) {
      fetchMoreData();
    }
  }, [inView]);

  return (
    <PageWrap>
      <ContentWrapper>
        <TitleWrapper>
          <Title>챌린지 쇼츠</Title>
          <ButtonGroup>
            <MintBtn>업로드</MintBtn>
            <MintBtn>인기순</MintBtn>
            <MintBtn>최신순</MintBtn>
          </ButtonGroup>
        </TitleWrapper>
        <ProfileImage
          src={isLoggedIn ? profileImage : default_profile}
          alt="Profile"
        />
        <VideoGridContainer>
          {videos.map((card) => (
            <VideoCard
              key={card.id}
              videos={card.videos}
              onClick={(video) => setSelectedVideo(video)}
            />
          ))}
          <div ref={ref} style={{ height: "20px" }} />
        </VideoGridContainer>
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
            likeIcon={likeIcon}
            title="예시 제목"
          />
        )}
      </ContentWrapper>
    </PageWrap>
  );
};

export default Community;
