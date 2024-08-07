import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import TimerBtn from "../common/TimerBtn"; // 타이머 버튼 컴포넌트
import AquaBtn from "../common/AquaBtn"; // 완료 버튼 컴포넌트
import { useSelector } from "react-redux";

// 배경 스타일 컴포넌트
const BlackBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
`;

// 모달 스타일 컴포넌트
const ModalWrap = styled.div`
  background-image: url(${GoogleModal});
  background-size: cover;
  background-position: center;
  width: 721px;
  height: 610px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;
  justify-content: center;
`;

// 제목 스타일 컴포넌트
const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #54595e;
`;

// 입력 필드 스타일 컴포넌트
const InputField = styled.input`
  width: 374px;
  height: 48px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: bold;
  color: #54595e;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 20px;
  margin-bottom: 20px;
  ::placeholder {
    color: #acacac; /* placeholder 글씨 색상 설정 */
  }
`;

// 버튼 랩퍼 스타일 컴포넌트
const BtnWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 374px;
  margin-top: 20px;
`;

// 기본 답변 목록
const defaultAnswers = ["유재석", "조각같음", "꽃사슴", "황홀함", "플랑크톤"];

// IntroductionModal 컴포넌트
const IntroductionModal = ({ onClose, onConfirm }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문 인덱스 상태
  const [answers, setAnswers] = useState([]); // 각 질문에 대한 답변 상태
  const [timerKey, setTimerKey] = useState(0); // 타이머 재시작을 위한 키 상태
  // Redux 상태에서 필요한 값들 가져오기
  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient); // WebSocket 클라이언트
  const questionList = useSelector((state) => state.question.questionList);

  // 서버에서 질문 목록을 받아오는 함수

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");

    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      console.log("방에서 받은 메시지:", parsedMessage);
      // if (
      //   parsedMessage.data == true &&
      //   parsedMessage.commandType == "GAME_START"
      // )
      //   navigate("/icebreaking/intro");
      // // setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      // else if (parsedMessage.message == "질문리스트 전파\n") {
      //   dispatch(setQuestionList(parsedMessage.data.question));
      //   console.log(parsedMessage.data.question);
      // }
    });
  }, [client, roomId]);

  useEffect(() => {
    console.log("Current questions list:", questionList);
  }, [questionList]);

  // 답변을 서버에 제출하는 함수
  const submitAnswers = () => {
    try {
      const message = {
        num: userNo, // 요청 바디에 userNo 포함
        answer: answers, // 요청 바디에 답변 배열 포함
      };

      client.send(
        `/app/game/${roomId}/self-introduction`, // 엔드포인트 URL
        {},
        JSON.stringify(message) // 메시지를 JSON 문자열로 변환하여 전송
      );

      console.log("답변 전송 성공:", message); // 성공 시 메시지 로그
    } catch (error) {
      console.error("답변 전송 실패:", error); // 오류 발생 시 오류 로그
    }
  };

  // currentQuestionIndex가 모든 질문을 초과하면 서버에 답변 제출
  useEffect(() => {
    if (
      currentQuestionIndex >= questionList.length &&
      questionList.length > 0
    ) {
      submitAnswers();
      onClose();
    }
  }, [currentQuestionIndex, questionList, onClose]);

  // 입력 필드 값이 변경될 때 호출되는 함수
  const handleQuestionChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  // "입력" 버튼 클릭 시 호출되는 함수
  const handleConfirm = () => {
    if (answers[currentQuestionIndex].trim() === "") {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = defaultAnswers[currentQuestionIndex];
      setAnswers(newAnswers);
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setTimerKey((prevKey) => prevKey + 1); // 타이머 재시작
  };

  // 타이머가 종료될 때 호출되는 함수
  const handleTimerEnd = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = defaultAnswers[currentQuestionIndex];
    setAnswers(newAnswers);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setTimerKey((prevKey) => prevKey + 1); // 타이머 재시작
  };

  // 엔터 키를 누를 때 호출되는 함수
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <BlackBg>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록 방지
        }}
      >
        {questionList.length > 0 && (
          <Title>{questionList[currentQuestionIndex]}</Title>
        )}
        {/* 현재 질문 표시 */}
        <TimerBtn
          key={timerKey}
          initialTime={5}
          onTimerEnd={handleTimerEnd}
        />{" "}
        {/* 타이머 버튼 */}
        <InputField
          type="text"
          placeholder="답변을 입력해주세요."
          value={answers[currentQuestionIndex] || ""}
          onChange={handleQuestionChange}
          onKeyPress={handleKeyPress} // 엔터 키 누를 때 처리
        />
        <BtnWrap>
          <AquaBtn text="입력" BtnFn={handleConfirm} /> {/* 입력 버튼 */}
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default IntroductionModal;
