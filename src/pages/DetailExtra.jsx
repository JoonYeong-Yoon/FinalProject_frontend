import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DetailExtra.css";
import api from "../api/api";

export default function DetailExtra() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "",
    bmi: "",
    phone: "",
    goal: "",
    dailyTime: "",
    weekly: "",
    prefer: [],
    pain: [],
    activity: "",
    targetPeriod: "",
    intro: "",
  });

  const handleChange = (key, value) => {
    let updated = { ...form, [key]: value };

    // BMI 자동 계산
    if (key === "height" || key === "weight") {
      const h = key === "height" ? value : updated.height;
      const w = key === "weight" ? value : updated.weight;

      if (h > 0 && w > 0) {
        const bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
        updated.bmi = bmi;
      }
    }

    setForm(updated);
  };

  const handleCheckArray = (key, value) => {
    if (form[key].includes(value)) {
      setForm({ ...form, [key]: form[key].filter((v) => v !== value) });
    } else {
      setForm({ ...form, [key]: [...form[key], value] });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const payload = { ...form };
      console.log("백엔드로 전송:", payload);

      // 1️⃣ 세부 정보 업데이트
      await api.put("/web/users/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2️⃣ 업데이트된 유저 정보 다시 불러오기
      const meRes = await api.get("/web/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3️⃣ 최신 유저 정보 저장
      localStorage.setItem("user", JSON.stringify(meRes.data));

      alert("추가 세부 정보 저장 완료!");
      navigate("/");

    } catch (err) {
      console.error("저장 실패:", err);
      alert("세부 정보 저장 중 오류 발생");
    }
  };

  return (
    <div className="detail-extra-wrapper">
      <div className="detail-extra-card">

        <h1 className="detail-title">추가 세부정보 입력</h1>
        <p className="detail-desc">
          더 정확한 맞춤 추천을 위해 아래 내용을 입력해주세요.
        </p>

        <h2 className="detail-section-title">신체 정보</h2>

        <div className="detail-flex-grid">

          {/* 전화번호 */}
          <div className="detail-field">
            <label className="detail-label">전화번호</label>
            <input
              type="tel"
              className="detail-input"
              placeholder="01012345678"
              value={form.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </div>

          <div className="detail-field">
            <label className="detail-label">나이</label>
            <input
              type="number"
              className="detail-input"
              value={form.age}
              min="0"
              onChange={(e) =>
                handleChange("age", e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))
              }
            />
          </div>

          <div className="detail-field">
            <label className="detail-label">키(cm)</label>
            <input
              type="number"
              className="detail-input"
              min="0"
              value={form.height}
              onChange={(e) =>
                handleChange("height", e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))
              }
            />
          </div>

          <div className="detail-field">
            <label className="detail-label">체중(kg)</label>
            <input
              type="number"
              className="detail-input"
              min="0"
              value={form.weight}
              onChange={(e) =>
                handleChange("weight", e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))
              }
            />
          </div>

          <div className="detail-field">
            <label className="detail-label">성별</label>
            <select
              className="detail-select"
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          <div className="detail-field">
            <label className="detail-label">BMI</label>
            <input className="detail-input" value={form.bmi || "-"} disabled />
          </div>

        </div>

        {/* 운동 정보 */}
        <h2 className="detail-section-title">운동 정보</h2>

        <div className="detail-field">
          <label className="detail-label">운동 목표</label>
          <select
            className="detail-select"
            value={form.goal}
            onChange={(e) => handleChange("goal", e.target.value)}
          >
            <option value="">선택</option>
            <option value="bulk">벌크업</option>
            <option value="lean">린매스업</option>
            <option value="diet">다이어트</option>
            <option value="health">건강/체력 증가</option>
          </select>
        </div>

        <div className="detail-field">
          <label className="detail-label">하루 운동 시간</label>
          <select
            className="detail-select"
            value={form.dailyTime}
            onChange={(e) => handleChange("dailyTime", e.target.value)}
          >
            <option value="">선택</option>
            <option value="30">30분</option>
            <option value="60">1시간</option>
            <option value="90">1시간 30분</option>
            <option value="120">2시간+</option>
          </select>
        </div>

        <div className="detail-field">
          <label className="detail-label">주당 운동 가능 횟수</label>
          <select
            className="detail-select"
            value={form.weekly}
            onChange={(e) => handleChange("weekly", e.target.value)}
          >
            <option value="">선택</option>
            <option value="1-2">1~2회</option>
            <option value="3-4">3~4회</option>
            <option value="5-6">5~6회</option>
            <option value="7">매일</option>
          </select>
        </div>

        <div className="detail-field">
          <label className="detail-subtitle">선호 운동</label>
          <div className="detail-checkbox-grid">
            {["웨이트", "유산소", "홈트", "요가", "필라테스"].map((item) => (
              <label key={item} className="detail-checkbox">
                <input
                  type="checkbox"
                  checked={form.prefer.includes(item)}
                  onChange={() => handleCheckArray("prefer", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="detail-field">
          <label className="detail-subtitle">부상/통증 부위</label>
          <div className="detail-checkbox-grid">
            {["허리", "무릎", "어깨", "목"].map((item) => (
              <label key={item} className="detail-checkbox">
                <input
                  type="checkbox"
                  checked={form.pain.includes(item)}
                  onChange={() => handleCheckArray("pain", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="detail-field">
          <label className="detail-subtitle">평소 활동량</label>
          <select
            className="detail-select"
            value={form.activity}
            onChange={(e) => handleChange("activity", e.target.value)}
          >
            <option value="">선택</option>
            <option value="low">거의 앉아있음</option>
            <option value="normal">보통</option>
            <option value="active">활동적</option>
          </select>
        </div>

        <div className="detail-field">
          <label className="detail-subtitle">목표 기간</label>
          <select
            className="detail-select"
            value={form.targetPeriod}
            onChange={(e) => handleChange("targetPeriod", e.target.value)}
          >
            <option value="">선택</option>
            <option value="1m">1개월</option>
            <option value="3m">3개월</option>
            <option value="6m">6개월</option>
            <option value="none">특별히 없음</option>
          </select>
        </div>

        <div className="detail-field">
          <label className="detail-subtitle">한 줄 소개</label>
          <textarea
            className="detail-textarea"
            rows="3"
            value={form.intro}
            placeholder="예: 3개월 안에 복근 만들고 싶어요!"
            onChange={(e) => handleChange("intro", e.target.value)}
          />
        </div>

        <div className="detail-button-area">
          <button className="detail-btn-cancel" onClick={() => navigate("/")}>
            건너뛰기
          </button>

          <button className="detail-btn-save" onClick={handleSubmit}>
            저장하기
          </button>
        </div>

      </div>
    </div>
  );
}
