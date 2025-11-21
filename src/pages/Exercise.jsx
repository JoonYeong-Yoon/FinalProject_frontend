// src/pages/Exercise.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Exercise.css";

export default function Exercise() {
  const navigate = useNavigate();
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const [uploadedMedia, setUploadedMedia] = useState(null);
  const fileInputRef = useRef(null);

  const API_BASE = "http://192.168.0.12:8000"; // 백엔드 주소

  // 업로드 처리
  const handleMediaSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 화면 표시(이미지 or 영상 자동 판단)
    setUploadedMedia({
      url: URL.createObjectURL(file),
      type: file.type,
    });

    // FormData 준비
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/video/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("서버 업로드 실패!");
        return;
      }

      const data = await res.json();
      console.log("AI 결과:", data);

      // ✔ AI 분석 결과 예: 무릎 위험 알림
      if (data.ai_result?.knee_warning) {
        alert("⚠ 무릎 위험: 자세가 올바르지 않습니다!");
      }

    } catch (err) {
      console.error("업로드 중 오류:", err);
      alert("서버 연결 실패");
    }
  };

  return (
    <div className="exercise-container">

      {/* ---------------- 상단 메뉴 ---------------- */}
      <div className="top-menu">
        <div className="menu-item" onClick={() => navigate("/routine")}>📅 나의 루틴</div>
        <div className="menu-item active" onClick={() => navigate("/exercise")}>🏋️ 운동 하기</div>
        <div className="menu-item" onClick={() => navigate("/report")}>📋 운동 리포트</div>
        <div className="menu-item" onClick={() => navigate("/facilities")}>📍 인근 운동시설 추천</div>
        <div className="menu-item" onClick={() => navigate("/calorie")}>🍎 영양소/칼로리 계산</div>
        <div className="menu-item" onClick={() => navigate("/products")}>🛒 건강식품/용품 추천</div>
      </div>

      <h2 className="exercise-title">💪 운동 하기: 루틴 실행 및 실시간 피드백</h2>

      <div className="exercise-layout">

        {/* -------- 왼쪽 -------- */}
        <div className="left-panel">
          <h3 className="panel-title">📢 AI 트레이너 피드백</h3>

          <div className="routine-box">선택된 루틴 없음</div>

          <div className="tts-toggle">
            <span>🔊 음성 피드백 (TTS)</span>
            <button
              className={`toggle-btn ${ttsEnabled ? "on" : "off"}`}
              onClick={() => setTtsEnabled(!ttsEnabled)}
            >
              {ttsEnabled ? "ON" : "OFF"}
            </button>
          </div>

          <textarea
            className="feedback-box"
            placeholder="루틴을 선택하고 운동을 시작해 주세요."
          ></textarea>

          <button className="save-btn">운동 기록 저장 및 종료</button>
        </div>

        {/* -------- 가운데 (업로드) -------- */}
        <div className="center-panel">
          <div className="video-box">

            {uploadedMedia ? (
              <>
                {uploadedMedia.type.includes("image") && (
                  <img src={uploadedMedia.url} className="uploaded-preview" alt="preview" />
                )}

                {uploadedMedia.type.includes("video") && (
                  <video
                    className="uploaded-preview"
                    src={uploadedMedia.url}
                    controls
                  />
                )}

                <button
                  className="upload-btn-dark"
                  onClick={() => fileInputRef.current.click()}
                >
                  다른 파일 선택하기
                </button>
              </>
            ) : (
              <div className="upload-area">
                <button
                  className="upload-btn-dark"
                  onClick={() => fileInputRef.current.click()}
                >
                  이미지/영상 업로드하기
                </button>
                <p className="drag-text">여기에 끌어다 놓으세요</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleMediaSelect}
            />

          </div>
        </div>

        {/* -------- 오른쪽 스트림 패널 -------- */}
        <div className="right-panel">
          <div className="video-box">
            <div className="warning-badge">⚠ 무릎 위치 위험! (TTS 피드백 연동)</div>
            <h3>나의 운동 영상 스트림</h3>
            <p>관절 인식 및 실시간 자세 교정 그래픽 Overlay</p>
          </div>
        </div>

      </div>
    </div>
  );
}
