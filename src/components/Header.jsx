import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import "../styles/Routine.css";

export default function Header() {
  const nav = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
    role: "", // 역할 추가
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const workoutPages = [
    "/dashboard",
    "/routine",
    "/exercise",
    "/report",
    "/calorie",
    "/community",
  ];

  const isWorkoutPage = workoutPages.includes(location.pathname);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("user"));
    const userRole = localStorage.getItem("role"); // role 가져오기
    
    if (savedProfile) {
      setProfile({
        name: savedProfile.name || "사용자",
        avatar: savedProfile.avatar || "/default-avatar-light.png",
        role: userRole || "user", // 기본값 user
      });
    }
  }, []);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    nav("/login");
  };

  // 프로필 아이콘 클릭
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
        <a onClick={() => nav("/community")}>커뮤니티</a>

        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src={profile.avatar} className="profile-img" alt="Profile" />
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => {
                nav("/profile");
                setIsDropdownOpen(false);
              }}>
                프로필 수정
              </div>

              {/* 관리자만 보이는 메뉴 */}
              {(profile.role === "admin" || profile.role === true || profile.role === "true") && (
                <div className="dropdown-item" onClick={() => {
                  nav("/admin");
                  setIsDropdownOpen(false);
                }}>
                  관리자 페이지
                </div>
              )}

              <div className="dropdown-item logout" onClick={handleLogout}>
                로그아웃
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}