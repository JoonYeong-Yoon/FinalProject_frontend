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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark-mode"));
    };
    handleTheme();
  }, []);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    goal: "",
    dailyTime: "",
    weekly: "",
    prefer: [],
    pain: [],
    activity: "",
    targetPeriod: "",
    intro: "",
    avatar: "",
  });

  const [editData, setEditData] = useState(profile);
  const token = localStorage.getItem("token");

  /* ------------------------------
      프로필 정보 불러오기
  ------------------------------- */
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await api.get("/web/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = {
          ...res.data,
          prefer: Array.isArray(res.data.prefer) ? res.data.prefer : [],
          pain: Array.isArray(res.data.pain) ? res.data.pain : [],
        };

        setProfile(data);
        setEditData(data);

        setAvatarPreview(data.avatar || null);
      } catch (err) {
        console.error("프로필 로드 실패:", err);
      }
    };

    load();
  }, [token]);

  /* ------------------------------
      BMI 계산
  ------------------------------- */
  const bmi = () => {
    if (!editData.height || !editData.weight) return "-";
    return (editData.weight / (editData.height / 100) ** 2).toFixed(1);
  };

  /* ------------------------------
      입력 변경 함수
  ------------------------------- */
  const change = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const changeArray = (field, value) => {
    const arr = editData[field] || [];
    if (arr.includes(value)) {
      setEditData({ ...editData, [field]: arr.filter((v) => v !== value) });
    } else {
      setEditData({ ...editData, [field]: [...arr, value] });
    }
  };

  /* ------------------------------
      저장하기
  ------------------------------- */
const handleSave = async () => {
  if (!token) return alert("로그인 필요");

  setIsLoading(true);
  const emailChanged = editData.email !== profile.email;

  try {
    const updated = {
      ...editData,
      username: editData.name,
      avatar: avatarPreview,
    };

    await api.put("/web/users/update", updated, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 🔥 이메일 바뀌어도 더 이상 로그아웃 안됨
    if (emailChanged) {
      alert("이메일이 변경되었습니다!");
    }

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

  /* ------------------------------
      계정 삭제
  ------------------------------- */
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

  /* ------------------------------
      아바타 업로드
  ------------------------------- */
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ------------------------------
      기본 아바타 경로
  ------------------------------- */
  const defaultAvatar = isDarkMode
    ? "/default-avatar-dark.png"
    : "/default-avatar-light.png";

  return (
    <div className="profile-wrapper">
      <header className="profile-header">
        <h1 className="profile-header-title">내 프로필</h1>
      </header>

      <div className="profile-container">
        <div className="profile-main">
          {/* ------------------------------
                왼쪽 카드
          ------------------------------ */}
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
                  value={editData.name}
                  onChange={(e) => change("name", e.target.value)}
                />
              ) : (
                <p className="info-value">{profile.name || "-"}</p>
              )}

              <label className="info-title">소개</label>
              {editing ? (
                <textarea
                  rows={3}
                  className="info-input"
                  value={editData.intro}
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
                  value={editData.email}
                  onChange={(e) => change("email", e.target.value)}
                />
              ) : (
                <p className="info-value">{profile.email || "-"}</p>
              )}

              <label className="info-title">
                <Phone size={14} /> 전화번호
              </label>

              {editing ? (
                <input
                  className="info-input"
                  type="tel"
                  value={editData.phone}
                  onChange={(e) =>
                    change("phone", e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              ) : (
                <p className="info-value">{profile.phone || "-"}</p>
              )}

              <label className="info-title">
                <Calendar size={14} /> 생성일
              </label>
              <p className="info-value">{profile.created_at || "-"}</p>
            </div>

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

          {/* ------------------------------
                오른쪽 상세 정보
          ------------------------------ */}
          <section className="profile-right-card stretch-card">
            <h2 className="section-title">상세 정보</h2>

            <div className="body-grid">
              
              {/* 나이 */}
              <div className="body-item">
                <label>나이</label>
                {editing ? (
                  <input
                    type="number"
                    className="body-input"
                    value={editData.age}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("age", "");
                      const num = Number(v);
                      if (num < 1) return change("age", "");
                      change("age", num);
                    }}
                  />
                ) : (
                  <p className="view-box">{profile.age || "-"}</p>
                )}
              </div>

              {/* 키 */}
              <div className="body-item">
                <label>키(cm)</label>
                {editing ? (
                  <input
                    type="number"
                    className="body-input"
                    value={editData.height}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("height", "");
                      const num = Number(v);
                      if (num < 1) return change("height", "");
                      change("height", num);
                    }}
                  />
                ) : (
                  <p className="view-box">{profile.height || "-"}</p>
                )}
              </div>

              {/* 체중 */}
              <div className="body-item">
                <label>체중(kg)</label>
                {editing ? (
                  <input
                    type="number"
                    className="body-input"
                    value={editData.weight}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") return change("weight", "");
                      const num = Number(v);
                      if (num < 1) return change("weight", "");
                      change("weight", num);
                    }}
                  />
                ) : (
                  <p className="view-box">{profile.weight || "-"}</p>
                )}
              </div>

              {/* BMI */}
              <div className="bmi-box">
                <label>BMI</label>
                <div className="bmi-row">
                  <span className="bmi-value">{bmi()}</span>
                  <span className="bmi-unit">kg/m²</span>
                </div>
              </div>

              {/* 성별 */}
              <div className="body-item">
                <label>성별</label>
                {editing ? (
                  <select
                    className="body-select"
                    value={editData.gender}
                    onChange={(e) => change("gender", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                ) : (
                  <p className="view-box">
                    {profile.gender === "male"
                      ? "남성"
                      : profile.gender === "female"
                      ? "여성"
                      : "-"}
                  </p>
                )}
              </div>

              {/* 운동 목표 */}
              <div className="body-item">
                <label>운동 목표</label>
                {editing ? (
                  <select
                    className="body-select"
                    value={editData.goal}
                    onChange={(e) => change("goal", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="bulk">벌크업</option>
                    <option value="lean">린매스업</option>
                    <option value="diet">다이어트</option>
                    <option value="health">체력 증가</option>
                  </select>
                ) : (
                  <p className="view-box">{profile.goal || "-"}</p>
                )}
              </div>

              {/* 하루 운동 시간 */}
              <div className="body-item">
                <label>하루 운동 시간</label>
                {editing ? (
                  <select
                    className="body-select"
                    value={editData.dailyTime}
                    onChange={(e) => change("dailyTime", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="30">30분</option>
                    <option value="60">60분</option>
                    <option value="90">90분</option>
                    <option value="120">120분 이상</option>
                  </select>
                ) : (
                  <p className="view-box">
                    {profile.dailyTime ? `${profile.dailyTime}분` : "-"}
                  </p>
                )}
              </div>

              {/* 주당 운동 */}
              <div className="body-item">
                <label>주당 운동</label>
                {editing ? (
                  <select
                    className="body-select"
                    value={editData.weekly}
                    onChange={(e) => change("weekly", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="1-2">1~2회</option>
                    <option value="3-4">3~4회</option>
                    <option value="5-6">5~6회</option>
                    <option value="7">매일</option>
                  </select>
                ) : (
                  <p className="view-box">{profile.weekly || "-"}</p>
                )}
              </div>

              {/* 선호 운동 */}
              <div className="body-item full-row">
                <label>선호 운동</label>

                {editing ? (
                  <div className="checkbox-grid">
                    {["웨이트", "유산소", "홈트", "요가", "필라테스"].map(
                      (item) => (
                        <label key={item} className="check-label">
                          <input
                            type="checkbox"
                            checked={editData.prefer.includes(item)}
                            onChange={() => changeArray("prefer", item)}
                          />
                          {item}
                        </label>
                      )
                    )}
                  </div>
                ) : (
                  <p className="view-box">
                    {Array.isArray(profile.prefer)
                      ? profile.prefer.join(", ")
                      : "-"}
                  </p>
                )}
              </div>

              {/* 부상 통증 */}
              <div className="body-item full-row">
                <label>부상 / 통증</label>

                {editing ? (
                  <div className="checkbox-grid">
                    {["허리", "무릎", "어깨", "목"].map((item) => (
                      <label key={item} className="check-label">
                        <input
                          type="checkbox"
                          checked={editData.pain.includes(item)}
                          onChange={() => changeArray("pain", item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="view-box">
                    {Array.isArray(profile.pain)
                      ? profile.pain.join(", ")
                      : "-"}
                  </p>
                )}
              </div>

              {/* 활동량 */}
              <div className="body-item">
                <label>활동량</label>
                {editing ? (
                  <select
                    className="body-select"
                    value={editData.activity}
                    onChange={(e) => change("activity", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="low">거의 앉아있음</option>
                    <option value="normal">보통</option>
                    <option value="active">활동적</option>
                  </select>
                ) : (
                  <p className="view-box">
                    {profile.activity === "low"
                      ? "거의 앉아있음"
                      : profile.activity === "normal"
                      ? "보통"
                      : profile.activity === "active"
                      ? "활동적"
                      : "-"}
                  </p>
                )}
              </div>

              {/* 목표 기간 */}
              <div className="body-item">
                <label>목표 기간</label>
                {editing ? (
                  <select
                    className="body-select"
                    value={editData.targetPeriod}
                    onChange={(e) => change("targetPeriod", e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="1m">1개월</option>
                    <option value="3m">3개월</option>
                    <option value="6m">6개월</option>
                    <option value="none">없음</option>
                  </select>
                ) : (
                  <p className="view-box">
                    {profile.targetPeriod === "1m"
                      ? "1개월"
                      : profile.targetPeriod === "3m"
                      ? "3개월"
                      : profile.targetPeriod === "6m"
                      ? "6개월"
                      : profile.targetPeriod === "none"
                      ? "없음"
                      : "-"}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="bottom-btn-box">
          <button className="home-btn" onClick={() => (window.location.href = "/")}>
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
