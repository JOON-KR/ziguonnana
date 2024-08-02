import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import TimerBtn from "../common/TimerBtn"; // 타이머 버튼 컴포넌트
import AquaBtn from "../common/AquaBtn"; // 완료 버튼 컴포넌트

// 배경 스타일
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

// 모달 스타일
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

// 제목 스타일
const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #54595e;
`;

// 입력 필드 스타일
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

// 버튼 랩퍼 스타일
const BtnWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 374px;
  margin-top: 20px;
`;

const questionsList = [
  "당신과 가장 닮은 연예인의 이름은?",
  "자신만의 얼굴 특징은?",
  "자신이 닮은 동물은?",
  "지금 표정에 드러나는 내 기분은?",
];

const defaultAnswers = ["유재석", "조각같음", "꽃사슴", "황홀함"];

const IntroductionModal = ({ onClose, onConfirm }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 질문 인덱스 상태
  const [answers, setAnswers] = useState(["", "", "", ""]); // 답변 상태

  // currentQuestionIndex가 모든 질문을 초과하면 onConfirm을 호출하여 답변을 제출
  useEffect(() => {
    if (currentQuestionIndex >= questionsList.length) {
      onConfirm(answers);
    }
  }, [currentQuestionIndex, answers, onConfirm]);

  // 입력 필드 값 변경 시 호출되는 함수
  const handleQuestionChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value; // 현재 질문의 답변을 업데이트
    setAnswers(newAnswers);
  };

  // 입력 버튼 클릭 시 호출되는 함수
  const handleConfirm = () => {
    if (answers[currentQuestionIndex].trim() === "") {
      // 현재 질문에 대한 답변이 비어있으면 기본 답변을 설정
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = defaultAnswers[currentQuestionIndex];
      setAnswers(newAnswers);
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // 다음 질문으로 이동
  };

  // 타이머 종료 시 호출되는 함수
  const handleTimerEnd = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = defaultAnswers[currentQuestionIndex]; // 현재 질문에 대한 기본 답변을 설정
    setAnswers(newAnswers);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // 다음 질문으로 이동
  };

  // 엔터 키 누를 때 입력 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록 방지
        }}
      >
        <Title>{questionsList[currentQuestionIndex]}</Title>{" "}
        {/* 현재 질문 표시 */}
        <TimerBtn initialTime={20} onTimerEnd={handleTimerEnd} />{" "}
        {/* 타이머 버튼 */}
        <InputField
          type="text"
          placeholder="답변을 입력해주세요."
          value={answers[currentQuestionIndex]}
          onChange={handleQuestionChange}
          onKeyPress={handleKeyPress} // 엔터 키 누를 때 처리
        />{" "}
        {/* 입력 필드 */}
        <BtnWrap>
          <AquaBtn text="입력" BtnFn={handleConfirm} /> {/* 입력 버튼 */}
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default IntroductionModal;
