// src/pages/Routine.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Routine.css";

export default function Routine() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);

  return (
    <div className="routine-container">

      {/* 상단 메뉴 */}
      <div className="top-menu">
        <div className="menu-item active" onClick={() => navigate("/routine")}>📅 나의 루틴</div>
        <div className="menu-item" onClick={() => navigate("/exercise")}>🏋️ 운동 하기</div>
        <div className="menu-item" onClick={() => navigate("/report")}>📋 운동 리포트</div>
        <div className="menu-item" onClick={() => navigate("/facilities")}>📍 인근 운동시설 추천</div>
        <div className="menu-item" onClick={() => navigate("/calorie")}>🍎 영양소/칼로리 계산</div>
        <div className="menu-item" onClick={() => navigate("/products")}>🛒 건강식품/용품 추천</div>
      </div>

      <h2 className="routine-title">📅 나의 운동 루틴: 루틴 선택 또는 AI 추천</h2>

      {/* 탭 선택 */}
      <div className="routine-select-tabs">
        <button
          className={`tab-btn ${tab === 1 ? "active" : ""}`}
          onClick={() => setTab(1)}
        >
          1. 루틴 직접 입력하기
        </button>

        <button
          className={`tab-btn ${tab === 2 ? "active" : ""}`}
          onClick={() => setTab(2)}
        >
          2. AI 트레이너 추천받기
        </button>
      </div>

      {/* -------------------- 직접 입력 -------------------- */}
      {tab === 1 && (
        <div className="content-box fade">
          <h3 className="subtitle">🏋️ 미리 설정된 루틴 선택</h3>
          <p className="subtext">아래 루틴 중 오늘 진행할 루틴을 선택해 주세요.</p>

          <div className="routine-list">
            <div className="routine-card">
              <h4>초급자 전신 코어 루틴</h4>
              <p>스쿼트 · 플랭크 · 푸시업 | 30분</p>
            </div>

            <div className="routine-card">
              <h4>다이어트 유산소 집중 루틴</h4>
              <p>버피 · 점핑잭 · 마운틴 클라이머 | 45분</p>
            </div>

            <div className="routine-card">
              <h4>상체 근력 강화 루틴</h4>
              <p>푸시업 · 덤벨 로우 · 암 레이즈 | 20분</p>
            </div>

            <div className="routine-card">
              <h4>하체 지구력 루틴</h4>
              <p>런지 · 스텝업 · 와이드 스쿼트 | 35분</p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- AI 추천 -------------------- */}
      {tab === 2 && (
        <div className="content-box ai fade">
          <h3 className="subtitle">🧠 AI 추천을 위한 데이터 선택</h3>

          <p className="subtext">
            어떤 데이터를 기반으로 루틴을 추천받으시겠습니까? (다중 선택 가능)
          </p>

          <div className="checkbox-group">
            <label><input type="checkbox" /> 지난 운동 데이터 기반</label>
            <label><input type="checkbox" /> 생체 리듬(웨어러블)</label>
            <label><input type="checkbox" /> 인바디 데이터</label>
          </div>

          <div className="info-box">
            선택된 데이터를 기반으로 AI 트레이너가  
            <b> “오늘의 최적 맞춤 루틴” </b>
            을 생성합니다.
          </div>

          <button className="ai-btn">AI 추천 루틴 확인 및 시작 ➜</button>
        </div>
      )}
    </div>
  );
}
