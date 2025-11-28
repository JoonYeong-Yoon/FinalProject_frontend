// src/pages/Dashboard.jsx
import React, { useState, useRef } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

import ParticleHuman from "../components/ParticleHuman";
import { muscleMap } from "../muscleMap";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [hoverMuscle, setHoverMuscle] = useState(null);

  const sectionRefs = useRef({});

  const user = JSON.parse(localStorage.getItem("user"));
  const avatar = user?.avatar ? user.avatar : "/default-avatar-light.png";

  // 🔥 스크롤 자동 선택
  const handleScroll = () => {
    const container = document.getElementById("scroll-panel");
    const center = container.scrollTop + container.clientHeight / 2;

    Object.keys(sectionRefs.current).forEach((key) => {
      const section = sectionRefs.current[key];
      if (!section) return;

      const { offsetTop, offsetHeight } = section;
      if (center >= offsetTop && center <= offsetTop + offsetHeight) {
        setSelectedMuscle(key);
      }
    });
  };

  const addRef = (key, el) => {
    sectionRefs.current[key] = el;
  };

  const content = [
    {
      key: "neck",
      title: "🧠 목(Neck)",
      desc: `목은 신체 중심을 안정시키고, 어깨·등 운동 자세를 유지하는 데 중요한 부위입니다.
장시간 컴퓨터 사용, 틀어진 자세 등으로 인해 쉽게 굳어지는 곳이기 때문에 운동 전후 스트레칭과 가벼운 강화 운동이 필요합니다.
- 흉쇄유돌근, 사각근
- 거북목 개선, 어깨·등 운동 자세 향상`,
    },
    {
      key: "shoulders",
      title: "💪 어깨(Shoulders)",
      desc: `어깨는 상체 전체 움직임의 시작점이며 전면·측면·후면 삼각근으로 구성됩니다.
- 실루엣 변화
- 안정된 운동 자세
- 숄더프레스, 레터럴레이즈, 리어델트`,
    },
    {
      key: "chest",
      title: "🦾 가슴(Chest)",
      desc: `가슴은 상부·중부·하부로 나뉘며 밀기 계열 운동을 담당합니다.
- 벤치프레스
- 인클라인 프레스
- 케이블 크로스오버`,
    },
    {
      key: "back",
      title: "🏋️ 등(Back)",
      desc: `등은 광배근, 승모근, 능형근 등 다양한 근육으로 구성.
- 체형 교정
- 등 넓어짐
- 랫풀다운, 바벨로우, 풀업`,
    },
    {
      key: "arms",
      title: "🫱 팔(Arms)",
      desc: `이두·삼두·전완이 균형 있어야 팔 라인이 예뻐짐.
- 컬
- 푸시다운
- 딥스`,
    },
    {
      key: "core",
      title: "🧩 복근/코어(Core)",
      desc: `코어는 전신 운동의 기반.
- 복직근, 복사근, 복횡근
- 플랭크, 레그레이즈`,
    },
    {
      key: "glutes",
      title: "🍑 엉덩이(Glutes)",
      desc: `하체 파워의 핵심.
- 힙쓰러스트
- 글루트브릿지
- 런지`,
    },
    {
      key: "thighs",
      title: "🦵 허벅지(Thighs)",
      desc: `대퇴사두·햄스트링·내전근까지 포함하는 큰 근육군.
- 스쿼트
- 레그프레스`,
    },
    {
      key: "calves",
      title: "🦶 종아리(Calves)",
      desc: `비복근·가자미근으로 구성.
- 카프레이즈`,
    },
  ];

  return (
    <div className="dashboard-wrapper">

      {/* 🔥 Glass Navbar */}
      <div className="glass-navbar">
        <div className="nav-left">
          <img src="/logo.png" className="logo-img" alt="logo" />
          <span className="logo-text">AI TRAINER</span>
        </div>

        <div className="nav-right">
          <a onClick={() => navigate("/routine")}>나의 루틴</a>
          <a onClick={() => navigate("/exercise")}>운동하기</a>
          <a onClick={() => navigate("/report")}>운동 리포트</a>
          <a onClick={() => navigate("/calorie")}>영양/칼로리</a>

          <div className="profile-icon" onClick={() => navigate("/profile")}>
            <img className="profile-img" src={avatar} alt="profile" />
          </div>
        </div>
      </div>

      {/* ======================================================
          🔥 메인 레이아웃
      ====================================================== */}
      <div className="dashboard-container">

        {/* 왼쪽 패널 */}
        <div className="dashboard-left">

          {/* 🔥 (고정된 제목 영역) */}
          <div className="title-area">
            <h1 className="dash-title">Welcome, Trainer!</h1>
            <p className="dash-sub">오늘의 운동 부위를 확인해보세요.</p>
          </div>

          {/* 🔥 스크롤 목록 */}
          <div
            id="scroll-panel"
            className="left-glass-panel"
            onScroll={handleScroll}
          >
            {content.map((sec) => (
              <div
                key={sec.key}
                ref={(el) => addRef(sec.key, el)}
                className={`muscle-section ${selectedMuscle === sec.key ? "active-section" : ""}`}
                onMouseEnter={() => setHoverMuscle(sec.key)}
                onMouseLeave={() => setHoverMuscle(null)}
              >
                <h2>{sec.title}</h2>
                <p style={{ whiteSpace: "pre-line" }}>{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 3D 모델 */}
        <div className="dashboard-right">
          <div className="human-wrapper">
            <ParticleHuman
              selectedMuscle={selectedMuscle}
              hoverMuscle={hoverMuscle}
              width={380}
              height={650}
            />
          </div>
        </div>

      </div>

      {/* 챗봇 */}
      <div className="chatbot-box">
        <div className="chatbot-btn">🤖</div>
      </div>
    </div>
  );
}
