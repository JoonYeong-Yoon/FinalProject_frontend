// src/pages/Exercise.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Exercise.css";

export default function Exercise() {
  const navigate = useNavigate();
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const [uploadedMedia, setUploadedMedia] = useState(null);
  const fileInputRef = useRef(null);

  const API_BASE = "http://192.168.0.12:8000";

  // 파일 업로드 처리
  const handleMediaSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedMedia({
      url: URL.createObjectURL(file),
      type: file.type,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/video/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("업로드 실패!");
        return;
      }

      const data = await res.json();
      console.log("AI 분석 결과:", data);

      if (data.ai_result?.knee_warning) {
        alert("⚠ 무릎 위험: 자세 교정이 필요합니다!");
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패");
    }
  };

  return (
    <div className="exercise-wrapper">

      {/* 헤더와 겹침 방지 */}
      <div className="top-gap" />

      <h1 className="exercise-title">🏋‍♂️ 루틴 실행 및 실시간 자세 피드백</h1>

      {/* 메인 레이아웃 */}
      <div className="exercise-grid">

        {/* 왼쪽 패널 */}
        <div className="panel-left">
          <h2 className="panel-header">📢 AI 트레이너 피드백</h2>

          <div className="routine-summary">선택된 루틴 없음</div>

          <div className="tts-row">
            <span>🔊 음성 피드백(TTS)</span>
            <button
              className={`toggle ${ttsEnabled ? "on" : "off"}`}
              onClick={() => setTtsEnabled(!ttsEnabled)}
            >
              {ttsEnabled ? "ON" : "OFF"}
            </button>
          </div>

          <textarea
            className="feedback-box"
            placeholder="루틴을 선택하고 운동을 시작해주세요."
          />

          <button className="finish-btn">운동 기록 저장 및 종료</button>
        </div>

        {/* 중앙 업로드 패널 */}
        <div className="panel-center">

          {!uploadedMedia ? (
            <div
              className="upload-dropzone"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="upload-label">📤 이미지 / 영상 업로드하기</div>
              <p className="upload-hint">여기에 끌어다 놓거나 클릭하여 업로드</p>
            </div>
          ) : (
            <div className="preview-box">
              {uploadedMedia.type.includes("image") && (
                <img src={uploadedMedia.url} className="preview-media" alt="preview" />
              )}

              {uploadedMedia.type.includes("video") && (
                <video src={uploadedMedia.url} className="preview-media" controls />
              )}

              <button
                className="change-btn"
                onClick={() => fileInputRef.current.click()}
              >
                🔄 다른 파일 선택하기
              </button>
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

        {/* 오른쪽 실시간 스트림 패널 */}
        <div className="panel-right">
          <div className="warning-box">⚠ 무릎 위치 위험 (AI 피드백 연동)</div>
          <h2 className="panel-header">🎥 실시간 운동 분석 스트림</h2>
          <p className="stream-desc">
            관절 인식 + 실시간 자세 교정 Overlay 그래픽 표시 예정
          </p>
        </div>

      </div>
    </div>
  );
}
