import styled from "styled-components";

const MintBtn = styled.button`
  background-color: #5ddad2;
  color: #f6f8fa; /* 텍스트 색상을 F6F8FA로 설정 */
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #1e8e89;
  }
`;

export default MintBtn;
