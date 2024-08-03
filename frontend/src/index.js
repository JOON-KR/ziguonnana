import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext"; // WebSocketProvider를 여기에 추가합니다.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <WebSocketProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </WebSocketProvider>
  //</React.StrictMode>
);

// reportWebVitals();

/*
Provider 라는 컴포넌트와 store.js를 임포트
그리고 밑에 <Provider store={import해온거}> 이걸로 <App/> 을 감싸준다
그럼 이제 <App>과 그 모든 자식컴포넌트들은 store.js에 있던 state를 맘대로 꺼내쓸 수 있음
*/
