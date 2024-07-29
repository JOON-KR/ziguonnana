import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import MyPage from "./pages/user/MyPage";
import GamePages from "./routes/GamePages";
import UserPages from "./routes/UserPages";
import PageTemplate from "./pages/iceBreaking/IceBreaking";
import IceBreaking from "./pages/iceBreaking/IceBreaking";
import Loading from "./pages/iceBreaking/Loading";
import Introduce from "./pages/iceBreaking/Introduce";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 게임 페이지들 묶음, 하위 페이지는 /games/???와 같이 접근*/}
        <Route path="/games/*" element={<GamePages />} />

        {/* 유저 관련 페이지들 묶음 */}
        <Route path="/user/*" element={<UserPages />} />

        <Route path="/icebreaking" element={<IceBreaking />}>
          <Route path="" element={<Loading />} />
          <Route path="intro" element={<Introduce />} />
        </Route>

        <Route path="/sample" element={<PageTemplate />} />
      </Routes>
    </div>
  );
}

export default App;
