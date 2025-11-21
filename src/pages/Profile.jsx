import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, Edit3, Save, X, Camera, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

export default function Profile() {
  const nav = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    height: "",
    weight: "",
    gender: "male",
    avatar: "",
  });

  const [editData, setEditData] = useState(profile);

  // 🔵 로컬 저장된 프로필 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profileData"));
    if (saved) {
      setProfile(saved);
      setEditData(saved);
      setAvatarPreview(saved.avatar);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const updatedProfile = {
      ...editData,
      avatar: avatarPreview || profile.avatar,
    };

    setProfile(updatedProfile);
    setIsEditing(false);

    localStorage.setItem("profileData", JSON.stringify(updatedProfile));
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  // 🔵 이미지 업로드
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgURL = URL.createObjectURL(file);
    setAvatarPreview(imgURL);
  };

  // 🔵 BMI 계산
  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      return (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);
    }
    return "-";
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return "-";

    if (bmi < 18.5) return "저체중";
    if (bmi < 25) return "정상";
    if (bmi < 30) return "과체중";
    return "비만";
  };

  return (
    <div className="profile-container">
      {/* 헤더 */}
      <div className="profile-header">
        <div className="profile-title-box">
          <User className="profile-title-icon" />
          <h1 className="profile-title">마이 프로필</h1>
        </div>

        <button
          className={`profile-edit-btn ${isEditing ? "cancel" : ""}`}
          onClick={isEditing ? handleCancel : handleEdit}
        >
          {isEditing ? (
            <>
              <X /> 취소
            </>
          ) : (
            <>
              <Edit3 /> 수정
            </>
          )}
        </button>
      </div>

      <div className="profile-grid">
        {/* LEFT CARD */}
        <div className="profile-card">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="avatar-img" />
              ) : (
                <User className="avatar-icon" />
              )}
            </div>

            {isEditing && (
              <button
                className="avatar-button"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className="avatar-button-icon" />
              </button>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>

          {/* 기본 정보 */}
          <div className="profile-info-list">
            <label className="profile-label">이름</label>
            {isEditing ? (
              <input
                className="profile-input"
                value={editData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            ) : (
              <p className="profile-text">{profile.name || "-"}</p>
            )}

            <label className="profile-label icon-label">
              <Mail /> 이메일
            </label>
            {isEditing ? (
              <input
                className="profile-input"
                value={editData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            ) : (
              <p className="profile-text">{profile.email || "-"}</p>
            )}

            <label className="profile-label icon-label">
              <Phone /> 전화번호
            </label>
            {isEditing ? (
              <input
                className="profile-input"
                value={editData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            ) : (
              <p className="profile-text">{profile.phone || "-"}</p>
            )}

            {isEditing && (
              <button className="profile-save-btn" onClick={handleSave}>
                <Save /> 저장하기
              </button>
            )}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="profile-card">
          <h2 className="card-title">
            <div className="title-bar"></div> 신체 정보
          </h2>

          <div className="profile-body-grid">
            <div>
              <label className="body-label">나이</label>
              {isEditing ? (
                <input
                  type="number"
                  className="profile-input"
                  value={editData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                />
              ) : (
                <p className="profile-text">{profile.age || "-"}</p>
              )}
            </div>

            <div>
              <label className="body-label">키(cm)</label>
              {isEditing ? (
                <input
                  type="number"
                  className="profile-input"
                  value={editData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                />
              ) : (
                <p className="profile-text">{profile.height || "-"}</p>
              )}
            </div>

            <div>
              <label className="body-label">체중(kg)</label>
              {isEditing ? (
                <input
                  type="number"
                  className="profile-input"
                  value={editData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
              ) : (
                <p className="profile-text">{profile.weight || "-"}</p>
              )}
            </div>

            <div>
              <label className="body-label">성별</label>
              {isEditing ? (
                <select
                  className="profile-input"
                  value={editData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              ) : (
                <p className="profile-text">
                  {profile.gender === "male" ? "남성" : "여성"}
                </p>
              )}
            </div>

            {/* BMI */}
            <div className="bmi-box">
              <label className="body-label">BMI</label>

              <div className="bmi-row">
                <span className="body-value">{calculateBMI()}</span>
                <span className="unit">kg/m²</span>

                <span
                  className={`bmi-status ${getBMIStatus()}`}
                >
                  {getBMIStatus()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 오른쪽 하단 고정 홈 버튼 */}
      <button className="go-home-btn" onClick={() => nav("/")}>
        <Home className="go-home-icon" /> 홈으로
      </button>
    </div>
  );
}
