import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  const nav = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
    role: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    const userRole = localStorage.getItem("role");
    
    if (savedProfile) {
      setProfile({
        name: savedProfile.name || "사용자",
        avatar: savedProfile.avatar || "/default-avatar-light.png",
        role: userRole || "user",
      });
    }
  }, []);

  // 프로필 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const hamburger = document.querySelector('.hamburger-menu');
        if (hamburger && !hamburger.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    nav("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (path) => {
    nav(path);
    setIsMobileMenuOpen(false);
  };

  if (!isWorkoutPage) return null;

  return (
    <>
      <div className="glass-navbar">
        <div className="nav-left" onClick={() => nav("/dashboard")}>
          <img src="/logo.png" className="logo-img" alt="Logo" />
          <span className="logo-text">AI TRAINER</span>
        </div>

        <div className="nav-right">
          {/* 햄버거 메뉴 버튼 */}
          <div 
            className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>

          {/* 일반 메뉴 (큰 화면) */}
          <div className="nav-links">
            <a onClick={() => nav("/routine")}>나의 루틴</a>
            <a onClick={() => nav("/exercise")}>자세교정</a>
            <a onClick={() => nav("/report")}>운동 리포트</a>
            <a onClick={() => nav("/calorie")}>영양/칼로리</a>
            <a onClick={() => nav("/community")}>커뮤니티</a>
          </div>

          {/* 프로필 아이콘 */}
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

      {/* 모바일 드롭다운 메뉴 */}
      <div 
        ref={mobileMenuRef}
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
      >
        <a onClick={() => handleNavClick("/routine")}>나의 루틴</a>
        <a onClick={() => handleNavClick("/exercise")}>자세교정</a>
        <a onClick={() => handleNavClick("/report")}>운동 리포트</a>
        <a onClick={() => handleNavClick("/calorie")}>영양/칼로리</a>
        <a onClick={() => handleNavClick("/community")}>커뮤니티</a>
      </div>
    </>
  );
}