import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import "../styles/Header.css";

export default function Header() {
  const nav = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
  });

  const [openDrop, setOpenDrop] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile) {
      setProfile({
        name: savedProfile.name || "사용자",
        avatar: savedProfile.avatar || "",
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <nav className="header-container">

      {/* 🔥 로고 커스터마이징 */}
      <div className="header-left" onClick={() => nav("/")}>
        <img src="/logo192.png" className="logo-icon" alt="logo" />
        <span className="logo-text">AI TRAINER</span>
      </div>

      {/* 오른쪽 버튼/프로필 */}
      <div className="header-right">

        {!isLoggedIn && (
          <>
            <button className="header-btn login" onClick={() => nav("/login")}>
              로그인
            </button>

            <button className="header-btn login" onClick={() => nav("/signup")}>
              회원가입
            </button>

            <button className="header-btn subscribe" onClick={() => nav("/subscribe")}>
              구독 신청
            </button>
          </>
        )}

        {isLoggedIn && (
          <div className="header-profile-box">
            <div className="profile-mini" onClick={() => setOpenDrop(!openDrop)}>
              <img
                src={profile.avatar || "/default-avatar.png"}
                className="profile-mini-img"
                alt="avatar"
              />
              <span className="profile-mini-name">{profile.name}</span>
              <ChevronDown className="profile-mini-down" />
            </div>

            {openDrop && (
              <div className="profile-dropdown">

                <button onClick={() => nav("/profile")}>
                  <User className="drop-icon" /> 마이 프로필
                </button>

                <div className="dropdown-divider" />

                <button onClick={() => nav("/challenge")}>🏆 챌린지</button>
                <button onClick={() => nav("/community")}>📸 커뮤니티</button>
                <button onClick={() => nav("/meal")}>🍱 식단 관리</button>
                <button onClick={() => nav("/history")}>📘 내 기록</button>

                <div className="dropdown-divider" />

                <button onClick={logout}>
                  <LogOut className="drop-icon" /> 로그아웃
                </button>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
