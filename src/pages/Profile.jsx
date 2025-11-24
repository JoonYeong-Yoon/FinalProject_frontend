import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  UserCircle,
  Home,
  Camera,
  Save,
  X,
  Trash2,
} from "lucide-react";
import "../styles/Profile.css";
import api from "../api/api";

export default function Profile() {
  const fileRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null); // 화면 표시용
  const [avatarFile, setAvatarFile] = useState(null); // 실제 서버 업로드용
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    avatar: "",
    created_at: "",
  });

  const [editData, setEditData] = useState(profile);
  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:8000";

  // 프로필 로드
  useEffect(() => {
    if (!token) return;

    const loadProfile = async () => {
      try {
        const res = await api.get("/web/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        if (data.avatar && !data.avatar.startsWith("http")) {
          data.avatar = API_BASE_URL + data.avatar;
        }

        setProfile(data);
        setEditData(data);

        // 이미 사용자가 새로 선택한 아바타가 있으면 덮어쓰지 않음
        setAvatarPreview(prev => prev || data.avatar);
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };

    loadProfile();
  }, [token]);

  // 아바타 선택 핸들러
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // 즉시 미리보기
  };

  // BMI 계산
  const bmi = () => {
    if (!editData.height || !editData.weight) return "-";
    return (editData.weight / (editData.height / 100) ** 2).toFixed(1);
  };

  const change = (field, value) => setEditData({ ...editData, [field]: value });

  // 저장
  const handleSave = async () => {
    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", editData.name);
      formData.append("email", editData.email);
      if (editData.phone) formData.append("phone", editData.phone);
      if (editData.age) formData.append("age", editData.age);
      if (editData.gender) formData.append("gender", editData.gender);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await api.put("/web/users/update", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      const updatedData = { ...editData };
      if (res.data.avatar && !res.data.avatar.startsWith("http")) {
        updatedData.avatar = API_BASE_URL + res.data.avatar;
      } else if (res.data.avatar) {
        updatedData.avatar = res.data.avatar;
      }

      setProfile(updatedData);
      setEditData(updatedData);
      setAvatarPreview(updatedData.avatar);
      setAvatarFile(null);
      setEditing(false);
      alert("저장되었습니다!");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 취소
  const handleCancel = () => {
    setEditData(profile);
    setAvatarPreview(profile.avatar); // 원래 아바타로 복원
    setAvatarFile(null);
    setEditing(false);
  };

  // 계정 탈퇴
  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ 계정을 삭제하시겠습니까?")) return;
    setIsLoading(true);
    try {
      await api.delete("/web/users/delete", { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("token");
      sessionStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error("계정 삭제 실패:", err);
      alert("계정 삭제 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <header className="profile-header">
        <div className="profile-header-content">
          <h1 className="profile-header-title">프로필 요약</h1>
        </div>
      </header>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-left">
            <div className="avatar">
              {avatarPreview ? <img src={avatarPreview} alt="avatar" className="avatar-img" /> : <UserCircle className="avatar-icon" />}
              {editing && (
                <button className="avatar-edit" onClick={() => fileRef.current.click()} disabled={isLoading}>
                  <Camera size={16} />
                </button>
              )}
              <input type="file" ref={fileRef} style={{ display: "none" }} accept="image/*" onChange={handleAvatar} disabled={isLoading} />
            </div>

            <div className="info">
              <div className="info-item">
                <label><User size={14} /> 이름</label>
                {editing ? <input type="text" value={editData.name} onChange={(e) => change("name", e.target.value)} className="info-input" /> : <p>{profile.name || "-"}</p>}
              </div>
              <div className="info-item">
                <label><Mail size={14} /> 이메일</label>
                {editing ? <input type="email" value={editData.email} onChange={(e) => change("email", e.target.value)} className="info-input" /> : <p>{profile.email || "-"}</p>}
              </div>
              <div className="info-item">
                <label><Phone size={14} /> 전화번호</label>
                {editing ? <input type="tel" value={editData.phone} onChange={(e) => change("phone", e.target.value)} className="info-input" /> : <p>{profile.phone || "-"}</p>}
              </div>
              <div className="info-item">
                <label><Calendar size={14} /> 계정 생성일</label>
                <p>{profile.created_at || "-"}</p>
              </div>
            </div>
          </div>

          <div className="edit-section">
            {!editing ? (
              <button className="edit-btn" onClick={() => setEditing(true)}><Edit3 size={18} /> 수정</button>
            ) : (
              <div className="edit-buttons">
                <button className="cancel-btn" onClick={handleCancel}><X size={18} /> 취소</button>
                <button className="save-btn" onClick={handleSave} disabled={isLoading}>{isLoading ? "저장 중..." : <><Save size={18} /> 저장</>}</button>
              </div>
            )}
          </div>
        </div>

        {/* 신체 정보 */}
        <div className="body-card">
          <h2 className="section-title">신체 정보</h2>
          <div className="body-grid">
            <div className="body-item">
              <label>나이</label>
              {editing ? <input type="number" value={editData.age} onChange={(e) => change("age", e.target.value)} className="body-input" /> : <p>{profile.age || "-"}</p>}
            </div>
            <div className="body-item">
              <label>키(cm)</label>
              {editing ? <input type="number" value={editData.height} onChange={(e) => change("height", e.target.value)} className="body-input" /> : <p>{profile.height || "-"}</p>}
            </div>
            <div className="body-item">
              <label>체중(kg)</label>
              {editing ? <input type="number" value={editData.weight} onChange={(e) => change("weight", e.target.value)} className="body-input" /> : <p>{profile.weight || "-"}</p>}
            </div>
            <div className="body-item">
              <label>성별</label>
              {editing ? (
                <select value={editData.gender} onChange={(e) => change("gender", e.target.value)} className="body-select">
                  <option value="">선택</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              ) : (
                <p>{profile.gender === "male" ? "남성" : profile.gender === "female" ? "여성" : "-"}</p>
              )}
            </div>
            <div className="bmi-box">
              <label>BMI</label>
              <div className="bmi-row">
                <span className="bmi-value">{editData.height && editData.weight ? bmi() : "-"}</span>
                <span className="bmi-unit">kg/m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* 계정 탈퇴 */}
        <div className="delete-section">
          <button className="delete-btn" onClick={handleDeleteAccount} disabled={isLoading}><Trash2 size={18} /> 계정 탈퇴</button>
        </div>

        <button className="home-btn" onClick={() => (window.location.href = "/")}><Home size={20} /> 홈</button>
      </div>
    </div>
  );
}
