// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import api from "../api/api";
import { getMyInfo, LoginAPI } from "../api/users";

export default function Login() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  // 🔥 이미 로그인되어 있으면 대시보드로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔥 로그인 버튼 클릭됨");

    try {
      // 1️⃣ 로그인 요청
      const data = await LoginAPI(email, pw);
      console.log(data);

      const token = data.access_token;

      // 2️⃣ 토큰 저장
      localStorage.setItem("token", token);

      // 3️⃣ 로그인한 유저 정보 불러오기
      const userData = await getMyInfo();
      console.log(userData);
      console.log("📊 유저 데이터:", userData); // 디버깅용

      // 4️⃣ user 정보 저장
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || null,
        })
      );

      // 5️⃣ ⭐ role 저장 (DB에서 가져온 값)
      const userRole = userData.role || "user"; // role이 없으면 기본값 "user"
      localStorage.setItem("role", userRole);

      console.log("🔑 저장된 role:", userRole); // 디버깅용

      alert("로그인 성공!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
      alert(err?.response?.data?.detail || "로그인 실패");
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    let locked = false;

    const onWheel = (e) => {
      if (locked) return;
      locked = true;

      if (e.deltaY > 0) {
        setCurrentSlide((prev) => Math.min(prev + 1, 2));
      } else {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => (locked = false), 700);
    };

    slider.addEventListener("wheel", onWheel);
    return () => slider.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    slider.style.transform = `translateY(-${currentSlide * 33.333}%)`;
  }, [currentSlide]);

  return (
    <div className="login-container">
      <div className="login-mainCard">
        <div className="login-left">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🏋️</span>
              <span className="logo-text">AI Trainer</span>
            </div>

            <h1 className="login-title">로그인</h1>
            <p className="login-subtitle">다시 돌아오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-submit">
              로그인
            </button>
          </form>

          <div className="login-footer">
            <p>
              아직 계정이 없나요?
              <span onClick={() => navigate("/signup")} className="footer-link">
                {" "}
                회원가입
              </span>
            </p>
          </div>
        </div>

        {/* 오른쪽 슬라이더 */}
        <div className="login-right">
          <div className="login-slider-wrapper">
            <div className="login-slider" ref={sliderRef}>
              {/* 첫 번째 슬라이드 - 대시보드 */}
              <div className="slider-card">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
                  className="slider-img"
                  alt="AI Trainer Dashboard"
                />
                <p className="slider-date">Dec 2025</p>
                <h2 className="slider-title">AI 트레이너와 함께하는 운동</h2>
                <p className="slider-desc">
                  인공지능이 당신의 운동 목표를 분석하고 맞춤형 루틴을
                  제공합니다.
                </p>
              </div>

              {/* 두 번째 슬라이드 - 운동 리포트 */}
              <div className="slider-card">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80"
                  className="slider-img"
                  alt="Workout Report"
                />
                <p className="slider-date">Dec 2025</p>
                <h2 className="slider-title">상세한 운동 리포트</h2>
                <p className="slider-desc">
                  운동 횟수, 소모 칼로리, 연속 운동일수를 한눈에 확인하세요.
                </p>
              </div>

              {/* 세 번째 슬라이드 - 커뮤니티 */}
              <div className="slider-card">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80"
                  className="slider-img"
                  alt="Community"
                />
                <p className="slider-date">Dec 2025</p>
                <h2 className="slider-title">함께 성장하는 커뮤니티</h2>
                <p className="slider-desc">
                  다른 사용자들과 운동 팁을 공유하고 동기부여를 받으세요.
                </p>
              </div>
            </div>
          </div>

          <div className="login-pagination">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`dot ${currentSlide === i ? "active" : ""}`}
                onClick={() => setCurrentSlide(i)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
