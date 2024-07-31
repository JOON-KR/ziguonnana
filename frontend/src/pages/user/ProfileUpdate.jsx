import React, { useState } from "react";
import { updateProfile } from "../api/mypage/mypageApi";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [feature, setFeature] = useState(["", "", ""]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(name, profileImage, feature);
      navigate("/mypage");
    } catch (e) {
      setError("프로필 업데이트 실패: " + e.message);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...feature];
    newFeatures[index] = value;
    setFeature(newFeatures);
  };

  return (
    <div>
      <h2>프로필 수정</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>프로필 이미지 URL:</label>
          <input
            type="text"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
          />
        </div>
        <div>
          <label>특징:</label>
          {feature.map((feat, index) => (
            <input
              key={index}
              type="text"
              value={feat}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
            />
          ))}
        </div>
        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
