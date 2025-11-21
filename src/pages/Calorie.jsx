import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Calorie.css";  // ★ 여기 경로가 정답!

export default function Calorie() {
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState("");
  const [weight, setWeight] = useState("");
  const [carb, setCarb] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [totalCalorie, setTotalCalorie] = useState(null);

  const calculateCalorie = () => {
    const total = Number(carb) * 4 + Number(protein) * 4 + Number(fat) * 9;
    setTotalCalorie(total);
  };

  return (
    <div className="calorie-container">
      <div className="top-menu">
        <div className="menu-item" onClick={() => navigate("/routine")}>📅 나의 루틴</div>
        <div className="menu-item" onClick={() => navigate("/exercise")}>🏋️ 운동 하기</div>
        <div className="menu-item" onClick={() => navigate("/report")}>📋 운동 리포트</div>
        <div className="menu-item" onClick={() => navigate("/facilities")}>📍 인근 운동시설 추천</div>
        <div className="menu-item active" onClick={() => navigate("/calorie")}>🍎 영양소/칼로리 계산</div>
        <div className="menu-item" onClick={() => navigate("/products")}>🛒 건강식품/용품 추천</div>
      </div>

      <h2 className="calorie-title">🍱 영양소/칼로리 계산기</h2>

      <div className="calorie-panel">
        <h3 className="panel-title">📝 음식 정보 입력</h3>

        <input
          className="input-box"
          placeholder="음식 이름 (예: 마라탕)"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />

        <input
          className="input-box"
          placeholder="무게 (g)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <div className="row">
          <input
            className="input-box small"
            placeholder="탄수화물 (g)"
            value={carb}
            onChange={(e) => setCarb(e.target.value)}
          />
          <input
            className="input-box small"
            placeholder="단백질 (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <input
            className="input-box small"
            placeholder="지방 (g)"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </div>

        <button className="calc-btn" onClick={calculateCalorie}>
          칼로리 계산하기
        </button>

        {totalCalorie !== null && (
          <div className="result-box">
            <span className="fire">🔥</span> 총 칼로리: {totalCalorie.toFixed(1)} kcal
          </div>
        )}
      </div>
    </div>
  );
}
