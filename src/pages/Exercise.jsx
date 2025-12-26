// src/pages/Exercise.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Exercise.css";
import { UploadExerciseVideo } from "../api/exercise";

export default function Exercise() {
  const navigate = useNavigate();
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // AI 추천 루틴 상태 추가
  const [aiRecommendedRoutine, setAiRecommendedRoutine] = useState(null);

  const fileInputRef = useRef(null);
  const API_BASE = "http://192.168.0.27:8000";

  // 기본 운동 루틴 목록
  const defaultRoutines = [
    {
      id: 1,
      name: "풀바디 루틴 A",
      exercises: [
        { name: "푸쉬업", sets: 3, reps: 15 },
        { name: "스쿼트", sets: 4, reps: 20 },
        { name: "플랭크", sets: 3, duration: "60초" },
      ],
      difficulty: "중급",
      duration: 45,
    },
    {
      id: 2,
      name: "하체 집중",
      exercises: [
        { name: "런지", sets: 4, reps: 12 },
        { name: "불가리안 스쿼트", sets: 3, reps: 10 },
        { name: "힙 쓰러스트", sets: 4, reps: 15 },
      ],
      difficulty: "고급",
      duration: 50,
    },
    {
      id: 3,
      name: "상체 + 코어",
      exercises: [
        { name: "덤벨 프레스", sets: 4, reps: 12 },
        { name: "바벨로우", sets: 3, reps: 10 },
        { name: "AB 롤아웃", sets: 3, reps: 12 },
      ],
      difficulty: "중급",
      duration: 40,
    },
  ];

  // 표시할 루틴 목록 (AI 추천이 있으면 맨 앞에 추가)
  const [routines, setRoutines] = useState(defaultRoutines);

  // AI 분석 결과가 들어왔을 때 루틴 목록 업데이트
  useEffect(() => {
    // 로컬 스토리지나 API 응답에서 AI 추천 루틴을 가져오는 로직
    // 여기서는 예시로 첫 번째 파일(pasted_content.txt)의 구조를 참고하여 매핑합니다.
    const fetchAiRoutine = async () => {
      try {
        // 실제 환경에서는 API 호출 결과나 전역 상태에서 가져옵니다.
        // 예시 데이터 구조 매핑:
        /*
        const mockAiData = {
          total_time_min: 15,
          items: [
            { exercise_name: "standing side crunch", set_count: 3, duration_sec: 45, met: 4 },
            { exercise_name: "plank", set_count: 3, duration_sec: 60, met: 3 }
          ]
        };
        */

        // 만약 aiAnalysis나 특정 상태에 데이터가 있다면 변환하여 routines에 추가
        if (aiRecommendedRoutine) {
          const formattedAiRoutine = {
            id: "ai-custom",
            name: "✨ AI 맞춤 추천 루틴",
            exercises: aiRecommendedRoutine.items.map((item) => ({
              name: item.exercise_name, // 필요시 exerciseNameKo 매핑 사용
              sets: item.set_count,
              reps:
                item.duration_sec > 0
                  ? `${item.duration_sec}초`
                  : `${item.reps}회`,
            })),
            difficulty: "중급", // AI 분석에 따라 가변 가능
            duration: aiRecommendedRoutine.total_time_min,
            isAiGenerated: true,
          };

          setRoutines([formattedAiRoutine, ...defaultRoutines]);
          setSelectedRoutine(formattedAiRoutine); // 자동으로 AI 루틴 선택
        }
      } catch (error) {
        console.error("AI 루틴 로드 실패:", error);
      }
    };

    fetchAiRoutine();
  }, [aiRecommendedRoutine]);

  // 자세 체크포인트
  const postureCheckpoints = [
    {
      id: 1,
      title: "무릎 정렬",
      status: "good",
      description: "무릎이 발끝과 일직선",
    },
    {
      id: 2,
      title: "척추 중립",
      status: "warning",
      description: "허리가 약간 구부러짐",
    },
    {
      id: 3,
      title: "어깨 위치",
      status: "good",
      description: "어깨가 바르게 정렬됨",
    },
    { id: 4, title: "골반 각도", status: "good", description: "골반이 안정적" },
  ];

  // AI 피드백 메시지
  const feedbackMessages = [
    "✅ 훌륭합니다! 자세가 완벽해요",
    "⚠️ 무릎을 조금 더 안쪽으로 모아주세요",
    "⚠️ 등을 곧게 펴주세요",
  ];
  console.log(uploadedMedia);

  // 파일 업로드 처리
  const handleMediaSelect = async (e) => {
    setIsAnalyzing(true);

    const file = e.target.files[0];
    if (!file) return;

    setUploadedMedia({
      url: URL.createObjectURL(file),
      type: file.type,
    });
    try {
      const res = await UploadExerciseVideo(file);
      const videoBlob = res;
      const videoUrl = URL.createObjectURL(videoBlob);
      setUploadedMedia({
        url: videoUrl,
        type: file.type,
      });
      setAiAnalysis(videoBlob);
      // 예시: 서버 응답에 ai_recommended_routine이 포함된 경우
      // if (res.ai_recommended_routine) {
      //   setAiRecommendedRoutine(res.ai_recommended_routine);
      // }
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 운동 시작
  const startExercise = () => {
    if (!selectedRoutine) {
      alert("루틴을 먼저 선택해주세요!");
      return;
    }
    alert(`${selectedRoutine.name} 운동을 시작합니다! 🏋️‍♂️`);
  };

  // 운동 완료
  const finishExercise = () => {
    if (window.confirm("운동을 종료하고 기록을 저장하시겠습니까?")) {
      const record = {
        routine: selectedRoutine?.name,
        date: new Date().toISOString(),
      };
      console.log("운동 기록:", record);

      setSelectedRoutine(null);
      setUploadedMedia(null);

      alert("운동 기록이 저장되었습니다! 🎉");
    }
  };

  return (
    <div className="exercise-wrapper">
      {/* 상단 헤더 */}
      <div className="exercise-header">
        <h1 className="exercise-title">🏋️‍♂️ AI 자세 교정 시스템</h1>
        <p className="exercise-subtitle">
          실시간으로 운동 자세를 분석하고 피드백을 받아보세요
        </p>
      </div>

      {/* 메인 레이아웃 */}
      <div className="exercise-grid">
        {/* 왼쪽 패널 - 루틴 및 피드백 */}
        <div className="panel-left">
          <h2 className="panel-header">📋 운동 루틴 선택</h2>

          <div className="routine-list">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className={`routine-card ${
                  selectedRoutine?.id === routine.id ? "selected" : ""
                } ${routine.isAiGenerated ? "ai-routine" : ""}`}
                onClick={() => setSelectedRoutine(routine)}
              >
                <div className="routine-header">
                  <h3 className="routine-name">{routine.name}</h3>
                  <span className={`difficulty-badge ${routine.difficulty}`}>
                    {routine.difficulty}
                  </span>
                </div>
                <div className="routine-info">
                  <span>⏱️ {routine.duration}분</span>
                  <span>💪 {routine.exercises.length}개 운동</span>
                </div>
              </div>
            ))}
          </div>

          {selectedRoutine && (
            <div className="selected-routine-detail">
              <h3 className="detail-title">운동 상세</h3>
              {selectedRoutine.exercises.map((exercise, idx) => (
                <div key={idx} className="exercise-item">
                  <span className="exercise-number">{idx + 1}</span>
                  <div className="exercise-info">
                    <span className="exercise-name">{exercise.name}</span>
                    <span className="exercise-detail">
                      {exercise.sets}세트 × {exercise.reps || exercise.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="control-section">
            <h3 className="section-title">🔊 음성 피드백</h3>
            <div className="tts-row">
              <span>실시간 음성 안내</span>
              <button
                className={`toggle ${ttsEnabled ? "on" : "off"}`}
                onClick={() => setTtsEnabled(!ttsEnabled)}
              >
                {ttsEnabled ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="start-btn" onClick={startExercise}>
              ▶️ 운동 시작
            </button>
            <button className="finish-btn" onClick={finishExercise}>
              ✓ 운동 완료 및 저장
            </button>
          </div>
        </div>

        {/* 중앙 패널 - 영상 업로드 및 분석 */}
        <div className="panel-center">
          <h2 className="panel-header">📹 운동 영상 분석</h2>

          {!uploadedMedia ? (
            <div
              className="upload-dropzone"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="upload-icon">📤</div>
              <div className="upload-label">이미지 / 영상 업로드하기</div>
              <p className="upload-hint">클릭하거나 파일을 드래그하여 업로드</p>
              <div className="upload-formats">
                <span>지원 형식: JPG, PNG, MP4, MOV</span>
              </div>
            </div>
          ) : (
            <div className="preview-box">
              {isAnalyzing && (
                <div className="analyzing-overlay">
                  <div className="spinner"></div>
                  <p>AI가 자세를 분석 중입니다...</p>
                </div>
              )}

              {uploadedMedia.type.includes("image") && (
                <img
                  src={uploadedMedia.url}
                  className="preview-media"
                  alt="preview"
                />
              )}

              {uploadedMedia.type.includes("video") && (
                <video
                  src={uploadedMedia.url}
                  className="preview-media"
                  controls
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              )}

              <div className="preview-controls">
                <button
                  className="change-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  🔄 다른 파일 선택
                </button>
                <button
                  className="analyze-btn"
                  onClick={() => setIsAnalyzing(true)}
                >
                  🤖 AI 재분석
                </button>
              </div>
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

        {/* 오른쪽 패널 - AI 피드백 */}
        <div className="panel-right">
          <h2 className="panel-header">🤖 AI 실시간 피드백</h2>

          {/* 자세 체크포인트 */}
          <div className="checkpoint-section">
            <h3 className="section-title">자세 체크포인트</h3>
            <div className="checkpoint-list">
              {postureCheckpoints.map((checkpoint) => (
                <div key={checkpoint.id} className="checkpoint-item">
                  <div className="checkpoint-header">
                    <span className={`status-dot ${checkpoint.status}`}></span>
                    <span className="checkpoint-title">{checkpoint.title}</span>
                  </div>
                  <p className="checkpoint-desc">{checkpoint.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 실시간 피드백 메시지 */}
          <div className="feedback-section">
            <h3 className="section-title">💬 실시간 코칭</h3>
            <div className="feedback-messages">
              {feedbackMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`feedback-message ${
                    msg.includes("⚠️") ? "warning" : "success"
                  }`}
                >
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 위험 경고 */}
          {aiAnalysis?.ai_result?.knee_warning && (
            <div className="warning-box">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <h4>무릎 위치 주의</h4>
                <p>
                  무릎이 발끝을 넘어가고 있습니다. 부상 위험이 있으니 자세를
                  교정해주세요.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
