import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import "../styles/Routine.css";

export default function Header() {
  const nav = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
  });

  const workoutPages = [
    "/dashboard",
    "/routine",
    "/exercise",
    "/report",
    "/calorie",
  ];

  const isWorkoutPage = workoutPages.includes(location.pathname);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("user"));
    if (savedProfile) {
      setProfile({
        name: savedProfile.name || "사용자",
        avatar: savedProfile.avatar || "/default-avatar-light.png",
      });
    }
  }, []);

  // 🔥 운동 페이지가 아니라면 헤더 자체를 렌더링하지 않음
  if (!isWorkoutPage) return null;

  return (
    <div className="glass-navbar">
      <div className="nav-left" onClick={() => nav("/dashboard")}>
        <img src="/logo.png" className="logo-img" alt="Logo" />
        <span className="logo-text">AI TRAINER</span>
      </div>

      <div className="nav-right">
        <a onClick={() => nav("/routine")}>나의 루틴</a>
        <a onClick={() => nav("/exercise")}>자세교정</a>
        <a onClick={() => nav("/report")}>운동 리포트</a>
        <a onClick={() => nav("/calorie")}>영양/칼로리</a>

        <div className="profile-icon" onClick={() => nav("/profile")}>
          <img src={profile.avatar} className="profile-img" alt="Profile" />
        </div>
      </div>
    </div>
  );
}
