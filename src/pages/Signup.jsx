// src/pages/Signup.jsx
import React, { useState } from "react";
import { Activity, TrendingUp, Users } from "lucide-react";
import "../styles/Signup.css";
import api from "../api/api";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 1️⃣ 회원가입
      const signupRes = await api.post("/web/users/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("회원가입 성공:", signupRes.data);

      // 2️⃣ 자동 로그인 진행
      const loginRes = await api.post("/web/users/login", {
        email: formData.email,
        password: formData.password,
      });

      if (loginRes.data?.access_token) {
        localStorage.setItem("token", loginRes.data.access_token);
      }

      // 3️⃣ 로그인한 유저 정보 불러오기
      const meRes = await api.get("/web/users/me", {
        headers: { Authorization: `Bearer ${loginRes.data.access_token}` },
      });

      // 4️⃣ localStorage에 user 저장 → 홈 화면에서 로그인 유지
      localStorage.setItem("user", JSON.stringify(meRes.data));

      alert("회원가입 완료! 세부정보를 입력해 주세요.");

      // 5️⃣ 세부사항 페이지로 이동
      window.location.href = "/detail-extra";

    } catch (err) {
      console.error("🔥 회원가입 실패:", err);
      alert(err?.response?.data?.detail || "회원가입 실패");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-mainCard">

        {/* LEFT */}
        <div className="signup-left">
          <div className="signup-header">
            <div className="signup-logo">
              <span className="logo-icon">🏋️</span>
              <span className="logo-text">AI Trainer</span>
            </div>

            <h1 className="signup-title">회원가입</h1>
            <p className="signup-subtitle">당신만의 AI 트레이너와 함께 시작하세요</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>사용자 이름</label>
              <input
                type="text"
                name="username"
                placeholder="이름 입력"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                placeholder="이메일 입력"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                name="password"
                placeholder="비밀번호 입력"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 다시 입력"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="signup-submit">회원가입</button>
          </form>

          <div className="signup-footer">
            <p>
              이미 계정이 있나요?
              <a href="/login" className="footer-link"> 로그인</a>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="signup-right">
          <h1 className="hero-title">
            Achieve Your Best<br />Performance.
          </h1>
          <p className="hero-subtitle">
            AI가 운동을 더 스마트하게, 효율적으로 만들어드립니다.
          </p>

          <div className="emergent-features">
            <div className="emergent-feature">
              <Activity size={26} className="emergent-icon" />
              <div>
                <h3>개인 맞춤 운동</h3>
                <p>목표와 체력 기반 분석</p>
              </div>
            </div>

            <div className="emergent-feature">
              <TrendingUp size={26} className="emergent-icon" />
              <div>
                <h3>지속적인 성장</h3>
                <p>AI 실시간 운동 학습</p>
              </div>
            </div>

            <div className="emergent-feature">
              <Users size={26} className="emergent-icon" />
              <div>
                <h3>커뮤니티 연동</h3>
                <p>함께 운동하며 동기부여 상승</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
