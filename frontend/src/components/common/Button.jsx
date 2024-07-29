import React from "react";

//공통적으로 사용하는 작은 컴포넌트 (버튼, 입력 필드 등은 common에 작성)
const Button = ({ btnText, func }) => {
  //전달받은 props 사용
  return <button onClick={func}>{btnText}</button>;
};

export default Button;
