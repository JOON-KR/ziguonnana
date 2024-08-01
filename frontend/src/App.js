import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import MyPage from "./pages/user/MyPage";
import GamePages from "./routes/GamePages";
import UserPages from "./routes/UserPages";
import PageTemplate from "./pages/iceBreaking/IceBreaking";
import IceBreaking from "./pages/iceBreaking/IceBreaking";
import Loading from "./pages/iceBreaking/Loading";
import Intro from "./pages/iceBreaking/Intro";
import GameRecord from "./pages/games/GameRecord";
import RoomCreateModal from "./components/modals/RoomCreateModal";
import OpenViduComponent from "./components/OpenViduComponent";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/gameRecord" element={<GameRecord />} />4
        {/* 유저 관련 페이지들 묶음 */}
        <Route path="/user/*" element={<UserPages />} />
        {/* 아이스브레이킹 입장 - 사람 6개 박아놓음. 하위 페이지는 /icebreaking/games/???와 같이 접근*/}
        <Route path="/icebreaking" element={<IceBreaking />}>
          {/* 게임 페이지들 묶음, 하위 페이지는 /icebreaking/games/???와 같이 접근*/}
          <Route path="/icebreaking/games/*" element={<GamePages />} />
          <Route path="" element={<Loading />} />
          <Route path="intro" element={<Intro />} />
        </Route>
        <Route path="/create-room" element={<RoomCreateModal />} />
        <Route path="/profilepick" element={<OpenViduComponent />} />
      </Routes>
    </div>
  );
}

export default App;
