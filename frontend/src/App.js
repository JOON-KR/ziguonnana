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

function App() {
  const navigate = useNavigate();
  // const [messages, setMessages] = useState([]);
  // const [inputValue, setInputValue] = useState('');
  // const [ws, setWs] = useState(null);

  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:8080/game');

  //   socket.onopen = () => {
  //     console.log('웹소켓 서버와 연결됨!');
  //   };

  //   socket.onmessage = (event) => {
  //     console.log('받은 메시지:', event.data);
  //     setMessages((prevMessages) => [...prevMessages, event.data]);
  //   };

  //   socket.onclose = () => {
  //     console.log('웹소켓 서버와 연결 끊김!');
  //   };

  //   setWs(socket);

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  // const sendMessage = () => {
  //   if (ws) {
  //     ws.send(inputValue);
  //     setInputValue('');
  //   }
  // };
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/gameRecord" element={<GameRecord />} />
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
      </Routes>
      {/* <h1>웹소켓 테스트</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>보냄</button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default App;
