import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit3,
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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark-mode"));
  }, []);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    birth_date: "",
    height_cm: "",
    weight_kg: "",
    body_fat: "",
    skeletal_muscle: "",
    bmr: "",
    water: "",
    visceral_fat_level: "",
    intro: "",
    avatar: "",
  });

  const [editData, setEditData] = useState(profile);
  const token = localStorage.getItem("token");

  /* ------------------------------------------
      프로필 불러오기
  ------------------------------------------- */
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await api.get("/web/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setProfile(data);
        setEditData(data);
        setAvatarPreview(data.avatar || null);
      } catch (err) {
        console.error("프로필 로드 실패:", err);
      }
    };

    load();
  }, [token]);

  /* ------------------------------------------
      BMI 계산
  ------------------------------------------- */
  const bmi = () => {
    if (!editData.height_cm || !editData.weight_kg) return "-";
    return (editData.weight_kg / (editData.height_cm / 100) ** 2).toFixed(1);
  };

  /* ------------------------------------------
      변경 핸들러
  ------------------------------------------- */
  const change = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  /* ------------------------------------------
      저장하기
  ------------------------------------------- */
  const handleSave = async () => {
    if (!token) return alert("로그인 필요");

    setIsLoading(true);

    try {
      const updated = {
        ...editData,
        username: editData.name,
        avatar: avatarPreview,
      };
      console.log(updated);
      await api.put("/web/users/update", updated, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(updated);
      setEditing(false);
      alert("저장 완료!");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 실패");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------
      계정 삭제
  ------------------------------------------- */
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete("/web/users/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("계정이 삭제되었습니다.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      alert("삭제 실패");
    }
  };

  /* ------------------------------------------
      아바타 업로드
  ------------------------------------------- */
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const defaultAvatar = isDarkMode
    ? "/default-avatar-dark.png"
    : "/default-avatar-light.png";

  /* ===================================================================
        RENDER
  =================================================================== */
  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-main">
          {/* ------------ LEFT CARD ------------ */}
          <aside className="profile-left-card">
            <div className="avatar">
              <img
                src={avatarPreview || defaultAvatar}
                className="avatar-img"
                alt="avatar"
              />

              {editing && (
                <button
                  className="avatar-edit"
                  onClick={() => fileRef.current.click()}
                >
                  <Camera size={18} />
                </button>
              )}

              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatar}
              />
            </div>

            <div className="profile-info-box">
              <label className="info-title">
                <User size={14} /> 이름
              </label>
              {editing ? (
                <input
                  className="info-input"
                  value={editData.name ?? ""}
                  onChange={(e) => change("name", e.target.value)}
                />
              ) : (
                <p className="info-value">{profile.name || "-"}</p>
              )}

              <label className="info-title">소개</label>
              {editing ? (
                <textarea
                  className="info-input"
                  rows={3}
                  value={editData.intro ?? ""}
                  onChange={(e) => change("intro", e.target.value)}
                />
              ) : (
                <p className="info-value">{profile.intro || "-"}</p>
              )}

              <label className="info-title">
                <Mail size={14} /> 이메일
              </label>
              {editing ? (
                <input
                  className="info-input"
                  value={editData.email ?? ""}
                  onChange={(e) => change("email", e.target.value)}
                />
              ) : (
                <p className="info-value">{profile.email || "-"}</p>
              )}

              <label className="info-title">
                <Calendar size={14} /> 생성일
              </label>
              <p className="info-value">{profile.created_at || "-"}</p>
            </div>

            {/* EDIT BUTTONS */}
            <div className="edit-btn-area">
              {!editing ? (
                <button className="edit-btn" onClick={() => setEditing(true)}>
                  <Edit3 size={16} /> 수정
                </button>
              ) : (
                <>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditing(false)}
                  >
                    <X size={16} /> 취소
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    <Save size={16} /> 저장
                  </button>
                </>
              )}
            </div>
          </aside>

          {/* ------------ DETAILS SECTION ------------ */}
          <section className="profile-right-card">
            <h2 className="section-title">상세 정보</h2>

            <div className="body-grid">
              {/* ------------ ROW 1 ------------ */}
              <div className="body-item">
                <label>생년월일</label>
                <input
                  type="date"
                  className={editing ? "body-input" : "body-input readonly"}
                  value={editData.birth_date ?? ""}
                  onChange={(e) => change("birth_date", e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className="body-item">
                <label>키</label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    className="body-input"
                    placeholder="cm"
                    value={editData.height_cm ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("height_cm", "");
                      const num = Number(v);
                      if (!Number.isFinite(num) || num <= 0) return;
                      change("height_cm", num);
                    }}
                  />
                ) : (
                  <p className="view-box">
                    {profile.height_cm ? `${profile.height_cm}cm` : "-"}
                  </p>
                )}
              </div>

              <div className="body-item">
                <label>체중</label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    className="body-input"
                    placeholder="kg"
                    value={editData.weight_kg ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("weight_kg", "");
                      const num = Number(v);
                      if (!Number.isFinite(num) || num <= 0) return;
                      change("weight_kg", num);
                    }}
                  />
                ) : (
                  <p className="view-box">
                    {profile.weight_kg ? `${profile.weight_kg}kg` : "-"}
                  </p>
                )}
              </div>

              {/* BMI */}
              <div className="body-item">
                <label>BMI</label>
                <div className="bmi-box">
                  <div className="bmi-row">
                    <span className="bmi-value">{bmi()}</span>
                    <span className="bmi-unit">kg/m²</span>
                  </div>
                </div>
              </div>

              {/* ------------ ROW 2 ------------ */}
              <div className="body-item">
                <label>체지방률</label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    className="body-input"
                    placeholder="%"
                    value={editData.body_fat ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("body_fat", "");
                      const num = Number(v);
                      if (!Number.isFinite(num) || num < 0) return;
                      change("body_fat", num);
                    }}
                  />
                ) : (
                  <p className="view-box">
                    {profile.body_fat ? `${profile.body_fat}%` : "-"}
                  </p>
                )}
              </div>

              <div className="body-item">
                <label>골격근량</label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    className="body-input"
                    placeholder="kg"
                    value={editData.skeletal_muscle ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("skeletal_muscle", "");
                      const num = Number(v);
                      if (!Number.isFinite(num) || num < 0) return;
                      change("skeletal_muscle", num);
                    }}
                  />
                ) : (
                  <p className="view-box">
                    {profile.skeletal_muscle ? `${profile.skeletal_muscle}kg` : "-"}
                  </p>
                )}
              </div>

              <div className="body-item">
                <label>기초대사량</label>
                {editing ? (
                  <input
                    type="number"
                    className="body-input"
                    placeholder="kcal"
                    value={editData.bmr ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("bmr", "");
                      const num = Number(v);
                      if (!Number.isFinite(num) || num < 0) return;
                      change("bmr", num);
                    }}
                  />
                ) : (
                  <p className="view-box">
                    {profile.bmr ? `${profile.bmr}kcal` : "-"}
                  </p>
                )}
              </div>

              <div className="body-item">
                <label>체수분</label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    className="body-input"
                    placeholder="%"
                    value={editData.water ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("water", "");
                      const num = Number(v);
                      if (!Number.isFinite(num) || num < 0) return;
                      change("water", num);
                    }}
                  />
                ) : (
                  <p className="view-box">
                    {profile.water ? `${profile.water}%` : "-"}
                  </p>
                )}
              </div>

              {/* ------------ ROW 3 ------------ */}
              <div className="body-item">
                <label>내장지방 레벨</label>
                {editing ? (
                  <input
                    type="number"
                    className="body-input"
                    value={editData.visceral_fat_level ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("visceral_fat_level", "");
                      const num = Number(v);
                      if (!Number.isFinite(num) || num < 0) return;
                      change("visceral_fat_level", num);
                    }}
                  />
                ) : (
                  <p className="view-box">{profile.visceral_fat_level || "-"}</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="bottom-btn-box">
          <button
            className="home-btn"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <Home size={18} /> 홈
          </button>

          <button className="delete-btn" onClick={handleDelete}>
            <Trash2 size={18} /> 계정 삭제
          </button>
        </div>
      </div>
    </div>
  );
}