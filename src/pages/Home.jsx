import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Moon, Sun, Check } from "lucide-react";

const defaultAvatar = "/default-avatar.png";

// 스크롤 기반 메시지들
const heroMessages = [
  {
    main: "Welcome Home, Trainer!",
    sub: "AI와 빅데이터가 만드는 당신만의 퍼스널 트레이닝 경험",
    showCTA: true,
  },
  {
    main: "AI가 당신의 트레이너",
    sub: "최적화된 운동 계획으로 목표 달성까지 함께합니다",
    showCTA: false,
  },
  {
    main: "데이터 기반 피트니스",
    sub: "수백만 건의 트레이닝 데이터로 가장 효과적인 방법을 제안합니다",
    showCTA: false,
  },
];

// 주요 기능 섹션 데이터
const features = [
  {
    title: "AI 맞춤 운동 계획",
    description: "인공지능이 당신의 체력 수준, 목표, 선호도를 분석하여 최적화된 운동 루틴을 자동으로 생성합니다. 매일 변화하는 컨디션에 맞춰 실시간으로 조정됩니다.",
    items: ["체력 분석", "목표 설정", "자동 루틴 생성", "실시간 조정", "진행도 추적", "성과 분석"]
  },
  {
    title: "빅데이터 기반 분석",
    description: "수백만 건의 트레이닝 데이터를 기반으로 가장 효과적인 운동 방법을 제안합니다. 당신과 유사한 사용자들의 성공 사례를 참고하여 최적의 결과를 도출합니다.",
    items: ["데이터 분석", "패턴 인식", "성공 사례 학습", "효과 예측", "개인화 추천", "통계 리포트"]
  },
  {
    title: "실시간 피드백",
    description: "AI 코치가 운동 중 자세와 동작을 실시간으로 분석하고 피드백을 제공합니다. 부상 위험을 줄이고 운동 효과를 극대화할 수 있습니다.",
    items: ["자세 분석", "동작 교정", "음성 피드백", "부상 예방", "운동 효율 향상", "실시간 코칭"]
  },
  {
    title: "영양 관리",
    description: "운동 목표에 맞는 식단을 AI가 자동으로 계획합니다. 칼로리, 영양소 균형을 고려한 맞춤형 식단 추천으로 건강한 식습관을 만들어갑니다.",
    items: ["식단 계획", "칼로리 계산", "영양소 분석", "레시피 추천", "식사 기록", "영양 밸런스"]
  }
];

// 요금제 데이터
const pricingPlans = [
  {
    name: "무료 체험",
    price: "₩0",
    period: "14일",
    description: "AI 트레이닝을 무료로 체험해보세요",
    features: ["기본 운동 계획", "AI 자세 분석", "진행도 추적", "커뮤니티 접근"],
    cta: "무료로 시작하기",
    popular: false
  },
  {
    name: "프로",
    price: "₩29,000",
    period: "월",
    description: "진지한 트레이닝을 위한 완벽한 선택",
    features: ["맞춤형 AI 운동 계획", "실시간 피드백", "영양 관리", "무제한 운동 기록", "전문가 상담", "우선 지원"],
    cta: "프로 시작하기",
    popular: true
  },
  {
    name: "팀",
    price: "₩99,000",
    period: "월",
    description: "팀과 함께 목표를 달성하세요",
    features: ["프로 플랜 모든 기능", "최대 10명 팀원", "팀 대시보드", "그룹 챌린지", "전담 매니저", "맞춤 교육"],
    cta: "팀 시작하기",
    popular: false
  }
];

const Home = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [textOpacity, setTextOpacity] = useState(1);
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

  // 스크롤 이벤트 - 메시지 변환 및 애니메이션
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // 스크롤 진행도 (전체)
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(scrolled);

      // 어떤 메시지를 보여줄지 결정 (히어로 섹션 높이: 300vh)
      const phraseIndex = Math.min(
        Math.floor(scrollY / (windowHeight * 0.5)),
        heroMessages.length - 1
      );
      setCurrentPhrase(phraseIndex);

      // 페이드 효과 계산
      const scrollProgressLocal = (scrollY % (windowHeight * 0.5)) / (windowHeight * 0.5);
      setOpacity(1 - scrollProgressLocal * 0.6);
      setTextOpacity(Math.max(0.3, 1 - scrollProgressLocal * 0.8));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 마우스 움직임 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
  };

  // 운동 기구 애니메이션 계산
  const dumbbell1Rotate = scrollProgress * 7.2;
  const kettlebell1Scale = 1 + scrollProgress * 0.003;
  const kettlebell2Scale = 1 + scrollProgress * 0.002;
  const parallaxX = (mousePos.x - window.innerWidth / 2) * 0.02;
  const parallaxY = (mousePos.y - window.innerHeight / 2) * 0.02;
  const progressPercent = Math.round((0.3 + scrollProgress * 0.007) * 100);

  const currentContent = heroMessages[currentPhrase];

  return (
    <div className={`home-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 애니메이션 배경 */}
      <div 
        className="animated-background-container"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 0.015)
        }}
      >
        {/* 배경 그라데이션 */}
        <div className="background-gradient"></div>

        {/* 상단 좌측 - 덤벨 */}
        <svg 
          className="animation-element dumbbell-1"
          style={{
            transform: `rotate(${dumbbell1Rotate}deg) translateX(${parallaxX}px) translateY(${parallaxY}px)`,
          }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="20" cy="50" rx="12" ry="18" fill="currentColor" />
          <rect x="32" y="45" width="36" height="10" fill="currentColor" />
          <ellipse cx="80" cy="50" rx="12" ry="18" fill="currentColor" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>

        {/* 상단 우측 - 케틀벨 */}
        <svg 
          className="animation-element kettlebell-1"
          style={{
            transform: `scale(${kettlebell1Scale}) translateX(${-parallaxX}px) translateY(${parallaxY}px)`,
          }}
          viewBox="0 0 100 100"
        >
          <path d="M 50 10 Q 60 15 65 30 Q 70 50 65 70 Q 60 85 50 90 Q 40 85 35 70 Q 30 50 35 30 Q 40 15 50 10" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="50" cy="60" rx="15" ry="20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>

        {/* 중단 좌측 - 요가 매트 */}
        <svg 
          className="animation-element yoga-mat"
          style={{
            transform: `rotate(${scrollProgress * 1.8}deg) translateX(${parallaxX * 0.5}px)`,
          }}
          viewBox="0 0 200 100"
        >
          <rect x="10" y="20" width="180" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="20" x2="30" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="70" y1="20" x2="70" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="90" y1="20" x2="90" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="110" y1="20" x2="110" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="130" y1="20" x2="130" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="150" y1="20" x2="150" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="170" y1="20" x2="170" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>

        {/* 중단 우측 - 저항 밴드 */}
        <svg 
          className="animation-element resistance-band"
          style={{
            transform: `scale(${kettlebell2Scale}) translateX(${-parallaxX * 0.5}px) translateY(${parallaxY}px)`,
          }}
          viewBox="0 0 100 100"
        >
          <path d="M 20 30 Q 50 20 80 30" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M 20 50 Q 50 40 80 50" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M 20 70 Q 50 60 80 70" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="20" cy="30" r="4" fill="currentColor" />
          <circle cx="80" cy="30" r="4" fill="currentColor" />
          <circle cx="20" cy="70" r="4" fill="currentColor" />
          <circle cx="80" cy="70" r="4" fill="currentColor" />
        </svg>

        {/* 하단 - 운동 심박수 그래프 */}
        <svg 
          className="animation-element heart-graph"
          style={{
            transform: `translateX(${parallaxX * 0.3}px) translateY(${-scrollProgress * 0.5}px)`,
          }}
          viewBox="0 0 300 100"
        >
          <polyline 
            points="10,50 30,45 50,60 70,40 90,55 110,35 130,50 150,30 170,55 190,40 210,60 230,35 250,50 270,45 290,55" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          />
          <line x1="10" y1="80" x2="290" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>

        {/* 하단 우측 - 운동 목표 진행도 */}
        <svg 
          className="animation-element progress-circle"
          style={{
            transform: `rotate(${scrollProgress * 3.6}deg) translateX(${-parallaxX * 0.5}px)`,
          }}
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <circle 
            cx="50" 
            cy="50" 
            r="35" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeDasharray={`${220 * (0.3 + scrollProgress * 0.007)} 220`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
          />
          <text x="50" y="55" textAnchor="middle" fontSize="16" fill="currentColor" opacity="0.6">
            {progressPercent}%
          </text>
        </svg>

        {/* 떠다니는 입자 효과 */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              left: `${15 + i * 15}%`,
              top: `${10 + i * 15}%`,
              animation: `float ${3 + i}s ease-in-out infinite`,
              transform: `translateY(${scrollProgress * (i + 1)}px)`,
            }}
          />
        ))}
      </div>

      {/* 헤더 */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-icon" />
          <span>AI TRAINER</span>
        </div>

        <nav className="nav-menu">
          <a href="#features" className="nav-link">기능</a>
          <a href="#about" className="nav-link">소개</a>
          <a href="#pricing" className="nav-link">요금</a>
        </nav>

        <div className="header-right">
          <button className="theme-toggle" onClick={toggleDarkMode} title="테마 전환">
            {isDarkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* 로그인 상태에 따라 표시 */}
          {user ? (
            <div className="user-menu" ref={menuRef}>
              <img
                src={user.avatar || defaultAvatar}
                alt="User Avatar"
                className="avatar"
              />

              <div className="user-info">
                <span
                  className="username"
                  onClick={toggleMenu}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  {user.name} <span className={`arrow ${menuOpen ? "open" : ""}`}>▼</span>
                </span>
              </div>

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
        </div>
      </header>

      {/* 히어로 섹션 - Mantis 스타일 */}
      <section className="hero-section-mantis">
        <div className="hero-sticky-container">
          {/* 상단 라벨 */}
          <div 
            className="hero-label"
            style={{ opacity: textOpacity }}
          >
            <span>홈 트레이닝 혁신</span>
          </div>

          {/* 메인 제목 */}
          <h1 
            className="hero-title-mantis"
            style={{ 
              opacity,
              transform: `translateY(${(1 - opacity) * 20}px)`
            }}
          >
            {currentContent.main}
          </h1>
          
          {/* 부제목 */}
          <p 
            className="hero-subtitle-mantis"
            style={{ 
              opacity: textOpacity,
              transform: `translateY(${(1 - textOpacity) * 10}px)`
            }}
          >
            {currentContent.sub}
          </p>
          
          {/* CTA 버튼 */}
          {currentContent.showCTA && (
            <div 
              className="hero-buttons-mantis"
              style={{ 
                opacity: textOpacity,
                transform: `scale(${0.9 + textOpacity * 0.1})`
              }}
            >
              <button className="btn primary-btn" onClick={() => navigate("/signup")}>
                <span>무료로 시작하기</span>
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn outline-btn">더 알아보기</button>
            </div>
          )}

          {/* 스크롤 인디케이터 */}
          <div 
            className="scroll-indicator"
            style={{ opacity: Math.max(0, 1 - (currentPhrase * 0.3)) }}
          >
            <span>스크롤</span>
            <div className="scroll-icon">
              <div className="scroll-dot"></div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 트레이닝의 힘 섹션 */}
      <section className="power-section" id="about">
        <div className="section-container">
          <div className="section-header">
            <h2>AI 트레이닝의 힘</h2>
            <p>최첨단 인공지능과 빅데이터 기술로 당신만의 퍼스널 트레이너를 경험하세요</p>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-items">
                  {feature.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="feature-item">
                      <Check size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section className="pricing-section" id="pricing">
        <div className="section-container">
          <div className="pricing-header">
            <h2>요금제</h2>
            <p>간단한 요금제</p>
            <p className="pricing-subtitle">당신에게 맞는 플랜을 선택하고 오늘부터 AI 트레이닝을 시작하세요</p>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.popular ? "popular" : ""}`}
              >
                {plan.popular && <div className="popular-badge">⭐ 인기</div>}
                
                <h3>{plan.name}</h3>
                <p className="pricing-description">{plan.description}</p>
                
                <div className="pricing-amount">
                  <span className="price">{plan.price}</span>
                  <span className="period">/ {plan.period}</span>
                </div>

                <ul className="pricing-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="pricing-btn">
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="footer">
        <div className="section-container">
          <p>&copy; 2024 AI TRAINER. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;