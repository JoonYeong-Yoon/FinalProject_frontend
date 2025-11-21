import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const defaultAvatar = "/default-avatar.png";

const Home = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // 로컬스토리지에서 유저 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <div className="home-container">
      {/* 헤더 */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-icon" />
          <span>AI TRAINER</span>
        </div>

        {/* 로그인 상태에 따라 표시 */}
        {user ? (
          <div className="user-menu" ref={menuRef}>
            <img
              src={user.avatar || defaultAvatar}
              alt="User Avatar"
              className="avatar"
            />

            <span
              className="username"
              onClick={toggleMenu}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              {user.name} <span className={`arrow ${menuOpen ? "open" : ""}`}>▼</span>
            </span>

            {/* 드롭다운 메뉴 */}
            {menuOpen && (
              <ul className="user-dropdown">
                <li onClick={() => navigate("/profile")}>프로필 수정</li>
                <li onClick={() => alert("챌린지 페이지 준비중!")}>챌린지</li>
                <li onClick={logout}>로그아웃</li>
              </ul>
            )}
          </div>
        ) : (
          <button className="btn login-btn" onClick={() => navigate("/login")}>
            로그인
          </button>
        )}
      </header>

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="background-slideshow">
          <div className="slide" style={{ backgroundImage: "url('/ex1.png')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/ex2.png')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/ex3.png')" }}></div>
        </div>

        <div className="hero-overlay">
          <h1 className="hero-title">Welcome Home, Trainer!</h1>
          <p className="hero-subtitle">
            AI와 빅데이터가 만드는 당신만의 퍼스널 트레이닝 경험
          </p>

          <div className="hero-buttons">
            <button className="btn primary-btn" onClick={() => navigate("/signup")}>
              무료로 시작하기 →
            </button>
            <button className="btn outline-btn">더 알아보기</button>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="features-section">
        <div className="features-content">
          <h2>AI Trainer 주요 기능 미리보기</h2>
          <p>사이트 전체 페이지 화면을 한 번에 보여드립니다.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
