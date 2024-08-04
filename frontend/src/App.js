import React from "react";

import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import MyPage from "./pages/user/MyPage";
import GamePages from "./routes/GamePages";
import UserPages from "./routes/UserPages";
import IceBreaking from "./pages/iceBreaking/IceBreaking";
import Loading from "./pages/iceBreaking/Loading";
import Intro from "./pages/iceBreaking/Intro";
import GameRecord from "./pages/games/GameRecord";
import RoomCreateModal from "./components/modals/RoomCreateModal";
import { WebSocketProvider } from "./context/WebSocketContext";
import { AppProvider } from "./context/AppContext"; // 추가된 부분

function App() {
  return (
    <AppProvider>
      {/* AppProvider로 전체를 감싸줍니다. */}
      <WebSocketProvider>
        {/* WebSocketProvider도 함께 사용합니다. */}
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/gameRecord" element={<GameRecord />} />
            <Route path="/user/*" element={<UserPages />} />
            <Route path="/icebreaking" element={<IceBreaking />}>
              <Route path="/icebreaking/games/*" element={<GamePages />} />
              <Route path="" element={<Loading />} />
              <Route path="intro" element={<Intro />} />
            </Route>
            <Route path="/create-room" element={<RoomCreateModal />} />
          </Routes>
        </div>
      </WebSocketProvider>
    </AppProvider>
  );
}

export default App;
