// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔥 로그인 버튼 클릭됨");

    try {
      const res = await api.post("/web/users/login", {
        email: email,
        password: pw,
      });

      // 토큰 저장
      localStorage.setItem("token", res.data.access_token);

      // 🔥 헤더 UI가 로그인 상태로 바뀌도록 user 정보도 저장
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: email.split("@")[0], // 임시 이름 (백엔드가 name 안 보내는 경우)
          avatar: null,
        })
      );

      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
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

            <button type="submit" className="login-submit">로그인</button>
          </form>

          <div className="login-footer">
            <p>
              아직 계정이 없나요?
              <span onClick={() => navigate("/signup")} className="footer-link">
                {" "}회원가입
              </span>
            </p>
          </div>
        </div>

        {/* 오른쪽 슬라이더 */}
        <div className="login-right">
          <div className="login-slider-wrapper">
            <div className="login-slider" ref={sliderRef}>
              <div className="slider-card">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80" className="slider-img" />
                <p className="slider-date">15 Oct 2025</p>
                <h2 className="slider-title">환상적인 산악 풍경</h2>
                <p className="slider-desc">웅장한 산맥과 구름 사이로 펼쳐지는 장관.</p>
              </div>

              <div className="slider-card">
                <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80" className="slider-img" />
                <p className="slider-date">22 Jun 2024</p>
                <h2 className="slider-title">신비로운 숲의 기운</h2>
                <p className="slider-desc">고요한 숲길을 걸어보세요.</p>
              </div>

              <div className="slider-card">
                <img src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=900&q=80" className="slider-img" />
                <p className="slider-date">30 Jun 2024</p>
                <h2 className="slider-title">꿈의 호수</h2>
                <p className="slider-desc">맑고 푸른 호수가 주는 평온함.</p>
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
