import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import VideoModal from "../../components/modals/VideoModal";
import TeamRecordModal from "../../components/modals/TeamRecordModal";
import community_bg from "../../assets/images/community_bg.png";
import default_profile from "../../assets/images/default_profile.png";
import MintBtn from "../../components/common/MintBtn";
import likeIcon from "../../assets/images/like_icon.png";
import axios from "axios";

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
  position: relative;
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
  position: relative;

`;

// 제목과 업로드 버튼을 감싸는 스타일 컴포넌트
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

`;

// 페이지 제목 스타일 컴포넌트
const Title = styled.h2`
  margin-top: 40px;
  font-size: 35px;
  font-weight: bold;
  color: #58fff5;
`;

// 업로드 버튼 스타일 컴포넌트
const UploadButton = styled(MintBtn)`
  width: 100px;
  height: 40px;
  font-size: 16px;
  margin-top: 100px;
  position: absolute;
  top: 20px;
  right: 0;
`;

// 버튼 그룹을 감싸는 스타일 컴포넌트
const ButtonGroup = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
`;

// 프로필 이미지를 표시하는 스타일 컴포넌트
const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
  object-fit: cover;
`;

const VideoGridContainer = styled.div`
  width: 660px;
  height: calc(100vh - 100px);
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* 여러 줄에 걸쳐 카드를 배치하기 위해 추가 */
  justify-content: space-between; /* 카드들 간에 균등한 간격을 두기 위해 추가 */
  gap: 1px; /* 카드들 사이의 간격을 설정 */

  /* 스크롤바 숨기기 */
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;


// 각 비디오 카드 스타일
const VideoCardWrapper = styled.div`
  width: calc(33.33% - 10px); /* 3개씩 배치 */
  max-width: 300px; /* 변경: 각 카드의 최대 너비를 설정 */
  flex-grow: 1; /* 추가: 공간이 있을 경우 카드를 확장 */
  @media (max-width: 768px) {
    width: calc(50% - 10px); /* 화면이 좁아지면 2개씩 배치 */
  }
  @media (max-width: 480px) {
    width: 100%; /* 화면이 더 좁아지면 1개씩 배치 */
  }
`;

const VideoThumbnail = styled.div`
  width: 220px;
  height: 150px;
  background-color: #eee;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black; /* 검은색 테두리 추가 */
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

// 배경을 흐리게 하는 스타일 컴포넌트
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Community = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [isTeamRecordVideo, setIsTeamRecordVideo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(default_profile);
  const [sortType, setSortType] = useState("latest");
  const { ref, inView } = useInView();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 비디오 데이터를 가져오는 함수
  const fetchVideos = async () => {
    try {
      const response = await axios.get("https://i11b303.p.ssafy.io/api/v1/article/video");
      console.log("API Response:", response);

      if (response.data.code === "status(201)") {
        console.log("Fetched video data:", response.data.data);

        const formattedVideos = response.data.data.map((video) => ({
          id: video.id,
          videos: [{
            url: video.videoUrl,
            title: video.title,
            likes: video.likeCount,
            views: video.viewCount,
            date: video.regDate ? new Date(video.regDate).toISOString().slice(0, 10) : '',
          }]
        }));
        setVideos(formattedVideos);
      } else {
        console.error("Unexpected response code:", response.data.code);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (inView) {
      fetchMoreData();
    }
  }, [inView]);

  useEffect(() => {
    if (sortType === "popular") {
      sortVideosByLikes();
    } else {
      sortVideosByDate();
    }
  }, [sortType]);

  const fetchMoreData = () => {
    // 추가 데이터 불러오기
  };

  const sortVideosByLikes = () => {
    const sorted = [...videos].sort((a, b) => {
      const likesA = a.videos.reduce((sum, video) => sum + video.likes, 0);
      const likesB = b.videos.reduce((sum, video) => sum + video.likes, 0);
      return likesB - likesA;
    });
    setVideos(sorted);
  };

  const sortVideosByDate = () => {
    const sorted = [...videos].sort((a, b) => {
      const dateA = new Date(a.videos[0].date);
      const dateB = new Date(b.videos[0].date);
      return dateB - dateA;
    });
    setVideos(sorted);
  };

  const handleVideoModalClose = () => {
    setSelectedVideoIndex(null);
    if (isTeamRecordVideo) {
      setIsUploadModalOpen(true);
      setIsTeamRecordVideo(false);
    }
  };

  const handleNextVideo = () => {
    setSelectedVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setSelectedVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const handleScroll = (e) => {
    if (e.deltaY > 0) {
      handleNextVideo(); // 스크롤을 내리면 다음 비디오로
    } else if (e.deltaY < 0) {
      handlePrevVideo(); // 스크롤을 올리면 이전 비디오로
    }
  };

  // 좋아요 후 리스트를 업데이트하는 함수
  const handleLikeUpdate = async () => {
    await fetchVideos(); // 비디오 리스트를 다시 불러옴
  };

  return (
    <PageWrap>
      <ContentWrapper>
        <TitleWrapper>
          <Title>챌린지 쇼츠</Title>
          {/* <UploadButton onClick={() => setIsUploadModalOpen(true)}>
            업로드
          </UploadButton> */}
        </TitleWrapper>
        <ProfileImage
          src={isLoggedIn ? profileImage : default_profile}
          alt="Profile"
        />
        <ButtonGroup>
          <MintBtn onClick={() => setSortType("popular")}>인기순</MintBtn>
          <MintBtn onClick={() => setSortType("latest")}>최신순</MintBtn>
        </ButtonGroup>
        
        <VideoGridContainer>
          {videos.map((card, index) => (
            <VideoCardWrapper key={card.id}>
              <VideoThumbnail onClick={() => setSelectedVideoIndex(index)}>
                <StyledVideo>
                  <source
                    src={card.videos[0].url}
                    type="video/mp4"
                  />
                </StyledVideo>
              </VideoThumbnail>
            </VideoCardWrapper>
          ))}
        </VideoGridContainer>


        {selectedVideoIndex !== null && (
          <Overlay onClick={handleVideoModalClose} onWheel={handleScroll}>
            <VideoModal
              videoSrc={videos[selectedVideoIndex].videos[0].url}
              videoType="video/mp4"
              onClose={handleVideoModalClose}
              likeIcon={likeIcon}
              title={videos[selectedVideoIndex].videos[0].title}
              likeCount={videos[selectedVideoIndex].videos[0].likes}
              showLikeAndTitle={!isTeamRecordVideo}
              onNext={handleNextVideo}
              onPrev={handlePrevVideo}
              articleId={videos[selectedVideoIndex].id} // 여기에 articleId를 전달
              onLike={handleLikeUpdate} // 좋아요 후 업데이트를 위한 콜백 전달
            />
          </Overlay>
        )}
        {isUploadModalOpen && (
          <Overlay onClick={() => setIsUploadModalOpen(false)}>
            <TeamRecordModal
              onClose={() => setIsUploadModalOpen(false)}
              onVideoSelect={(videoUrl) => {
                setSelectedVideoIndex(videos.findIndex(v => v.videos[0].url === videoUrl));
                setIsUploadModalOpen(false);
                setIsTeamRecordVideo(true);
              }}
            />
          </Overlay>
        )}
      </ContentWrapper>
    </PageWrap>
  );
};

export default Community;
