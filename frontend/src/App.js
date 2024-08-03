// App.js
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
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <PrivateRoute path="/mypage" element={<MyPage />} />
        <PrivateRoute path="/gameRecord" element={<GameRecord />} />
        <PrivateRoute path="/user/*" element={<UserPages />} />
        <PrivateRoute path="/icebreaking" element={<IceBreaking />}>
          <PrivateRoute path="/icebreaking/games/*" element={<GamePages />} />
          <PrivateRoute path="" element={<Loading />} />
          <PrivateRoute path="intro" element={<Intro />} />
        </PrivateRoute>
        <PrivateRoute path="/create-room" element={<RoomCreateModal />} />
      </Routes>
    </div>
  );
}

export default App;
