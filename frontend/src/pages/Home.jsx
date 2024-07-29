import React, { useState } from "react";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, setSalary } from "../store/salary/salarySlice";

const Home = () => {
  // state는 store.js의 모든 reducer의 {}형태
  const 월급 = useSelector((state) => state.salary);
  const [newSalary, setNewSalary] = useState(월급);

  const dispatch = useDispatch(); // 변경 요청을 보내주는 함수

  console.log(월급);
  return (
    <div>
      <Header />
      <h1>Home</h1>
      <span>월급 : {월급}</span>
      <Button
        btnText="월급업"
        func={() => {
          dispatch(increment());
        }}
      />
      <Button
        btnText="월급다운"
        func={() => {
          dispatch(decrement());
        }}
      />
      <div>
        <input
          type="number"
          value={newSalary}
          onChange={(e) => setNewSalary(e.target.value)}
          placeholder="원하는 월급"
        />
        <Button
          btnText="이만큼 받을래요"
          func={() => {
            dispatch(setSalary(Number(newSalary)));
          }}
        />
      </div>
    </div>
  );
};

export default Home;
