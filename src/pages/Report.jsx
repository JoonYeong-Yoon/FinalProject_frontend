// src/pages/Report.jsx
import React from "react";
import "../styles/Report.css";
import { Line, Doughnut, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip
);

export default function Report() {
  /* -----------------------------------------
      📌 데모 데이터 (추후 API 연결 가능)
  ----------------------------------------- */
  const weeklyWorkoutTime = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "운동 시간 (분)",
        data: [30, 40, 20, 50, 60, 90, 70],
        borderColor: "#b57aff",
        backgroundColor: "rgba(181,122,255,0.2)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#d9b3ff",
      },
    ],
  };

  const calorieCompare = {
    labels: ["섭취", "소모"],
    datasets: [
      {
        label: "칼로리",
        data: [1800, 2400],
        backgroundColor: ["#ff8fa3", "#b57aff"],
        borderRadius: 8,
      },
    ],
  };

  const sleepDoughnut = {
    labels: ["깊은수면", "얕은수면", "REM"],
    datasets: [
      {
        data: [25, 50, 25],
        backgroundColor: ["#6C5CE7", "#B39DDB", "#9575CD"],
      },
    ],
  };

  const heartRateData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "심박수(BPM)",
        data: [72, 75, 70, 74, 77, 80, 76],
        borderColor: "#ff8fa3",
        backgroundColor: "rgba(255,143,163,0.2)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#ffb3c1",
      },
    ],
  };

  return (
    <div className="report-wrapper">

      {/* ======================================
          HEADER SPACE (헤더 겹침 방지 여백)
      ======================================= */}
      <div className="header-spacing"></div>

      {/* ======================================
          📌 상단 KPI 요약 박스
      ======================================= */}
      <h1 className="report-title">이번 주 나의 운동 기록</h1>

      <div className="kpi-grid">

        <div className="kpi-card">
          <p className="kpi-label">총 운동 횟수</p>
          <h2 className="kpi-value">12회</h2>
          <span className="kpi-sub">지난주 대비 +8%</span>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">총 운동 시간</p>
          <h2 className="kpi-value">5시간 20분</h2>
          <span className="kpi-sub">+40분 증가</span>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">총 소모 칼로리</p>
          <h2 className="kpi-value">2,450 kcal</h2>
          <span className="kpi-sub">+12%</span>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">연속 운동</p>
          <h2 className="kpi-value">8일</h2>
          <span className="kpi-sub">목표 14일</span>
        </div>

      </div>

      {/* ======================================
          📊 메인 그래프
      ======================================= */}
      <div className="graph-card large">
        <h2 className="graph-title">주간 운동 시간 변화</h2>
        <Line data={weeklyWorkoutTime} height={90} />
      </div>

      {/* ======================================
          📈 분석 카드 (3개)
      ======================================= */}
      <div className="analysis-grid">

        {/* 수면 분석 */}
        <div className="analysis-card">
          <h3 className="analysis-title">수면 패턴 분석</h3>
          <Doughnut data={sleepDoughnut} />
        </div>

        {/* 심박수 변화 */}
        <div className="analysis-card">
          <h3 className="analysis-title">주간 심박수 변화</h3>
          <Line data={heartRateData} height={80} />
        </div>

        {/* 칼로리 비교 */}
        <div className="analysis-card">
          <h3 className="analysis-title">칼로리 섭취 / 소모</h3>
          <Bar data={calorieCompare} height={80} />
        </div>

      </div>

      {/* ======================================
          📋 최근 운동 리스트
      ======================================= */}
      <h2 className="recent-title">최근 운동 기록</h2>

      <div className="recent-list">

        <div className="recent-item">
          <div>
            <h3>하체 근력 루틴</h3>
            <p>45분 · 320 kcal</p>
          </div>
          <span>2024.02.11</span>
        </div>

        <div className="recent-item">
          <div>
            <h3>상체 코어 루틴</h3>
            <p>30분 · 210 kcal</p>
          </div>
          <span>2024.02.10</span>
        </div>

        <div className="recent-item">
          <div>
            <h3>유산소 인터벌</h3>
            <p>20분 · 180 kcal</p>
          </div>
          <span>2024.02.09</span>
        </div>

      </div>
    </div>
  );
}
