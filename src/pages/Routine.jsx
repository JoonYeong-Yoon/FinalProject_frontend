// src/pages/Routine.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Routine.css";

export default function Routine() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [userRoutines, setUserRoutines] = useState([]);
  const [aiOptions, setAiOptions] = useState({
    pastData: false,
    bioRhythm: false,
    inbody: false,
  });

  // 사용자 정의 루틴 생성 상태
  const [customRoutine, setCustomRoutine] = useState({
    name: "",
    level: "초급",
    exercises: [{ name: "", sets: 3, reps: 10 }],
  });

  // 운동 세션 상태
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const timerRef = useRef(null);

  // 유저 정보
  const user = JSON.parse(localStorage.getItem("user"));
  const avatar = user?.avatar ? user.avatar : "/default-avatar-light.png";

  const initialRoutines = [
    {
      id: 1,
      title: "초급자 전신 코어 루틴",
      exercises: [
        { name: "스쿼트", sets: 3, reps: 15 },
        { name: "플랭크", sets: 3, reps: 30 },
        { name: "푸시업", sets: 3, reps: 10 },
      ],
      duration: 30,
      level: "초급",
      calories: 180,
    },
    {
      id: 2,
      title: "다이어트 유산소 집중 루틴",
      exercises: [
        { name: "버피", sets: 4, reps: 10 },
        { name: "점핑잭", sets: 3, reps: 30 },
        { name: "마운틴 클라이머", sets: 3, reps: 20 },
      ],
      duration: 45,
      level: "중급",
      calories: 350,
    },
    {
      id: 3,
      title: "상체 근력 강화 루틴",
      exercises: [
        { name: "푸시업", sets: 4, reps: 12 },
        { name: "덤벨 로우", sets: 3, reps: 10 },
        { name: "암 레이즈", sets: 3, reps: 15 },
      ],
      duration: 20,
      level: "중급",
      calories: 150,
    },
    {
      id: 4,
      title: "하체 지구력 루틴",
      exercises: [
        { name: "런지", sets: 3, reps: 12 },
        { name: "스텝업", sets: 3, reps: 15 },
        { name: "와이드 스쿼트", sets: 4, reps: 12 },
      ],
      duration: 35,
      level: "중급",
      calories: 280,
    },
  ];

  const [routines, setRoutines] = useState(initialRoutines);

  // 운동 선택지 목록
  const EXERCISE_OPTIONS = [
    "스쿼트", "플랭크", "푸시업", "버피", "점핑잭", "마운틴 클라이머",
    "덤벨 로우", "암 레이즈", "런지", "스텝업", "와이드 스쿼트", "데드리프트",
    "오버헤드 프레스", "벤치 프레스", "레그 프레스"
  ];

  // 카운트다운 및 타이머 로직
  useEffect(() => {
    if (!showWorkoutModal || !workoutStarted) return;

    // 카운트다운
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timerRef.current);
    }

    // 운동 타이머
    if (!isPaused && !workoutComplete) {
      timerRef.current = setInterval(() => {
        if (isResting) {
          setRestTime((prev) => {
            if (prev <= 1) {
              setIsResting(false);
              return 60;
            }
            return prev - 1;
          });
        } else {
          setElapsedTime((prev) => prev + 1);
        }
      }, 1000);
      return () => clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        clearTimeout(timerRef.current);
      }
    };
  }, [showWorkoutModal, workoutStarted, countdown, isPaused, isResting, workoutComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    setCountdown(3);
    setCurrentExerciseIndex(0);
    setElapsedTime(0);
    setCompletedExercises([]);
    setWorkoutComplete(false);
    setIsResting(false);
    setIsPaused(false);
  };

  const handleCompleteExercise = () => {
    const currentExercise = selectedRoutine.exercises[currentExerciseIndex];
    setCompletedExercises([...completedExercises, currentExercise.name]);

    if (currentExerciseIndex < selectedRoutine.exercises.length - 1) {
      setIsResting(true);
      setRestTime(60);
      setTimeout(() => {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      }, 100);
    } else {
      setWorkoutComplete(true);
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTime(60);
  };

  const handleCloseWorkout = () => {
    setShowWorkoutModal(false);
    setWorkoutStarted(false);
    setCountdown(3);
    setCurrentExerciseIndex(0);
    setElapsedTime(0);
    setCompletedExercises([]);
    setWorkoutComplete(false);
    setIsResting(false);
    setIsPaused(false);
  };

  const handleRoutineSelect = (routine) => {
    setSelectedRoutine(routine);
  };

  const handleAiOptionChange = (option) => {
    setAiOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleAiRecommend = () => {
    console.log("AI 추천 요청:", aiOptions);
    alert("AI가 맞춤 루틴을 생성 중입니다...");
  };

  // 사용자 정의 루틴 함수들
  const handleCustomExerciseChange = (index, field, value) => {
    const newExercises = [...customRoutine.exercises];
    newExercises[index][field] = field === "name" ? value : parseInt(value) || 0;
    setCustomRoutine({ ...customRoutine, exercises: newExercises });
  };

  const handleAddExercise = () => {
    setCustomRoutine({
      ...customRoutine,
      exercises: [...customRoutine.exercises, { name: "", sets: 3, reps: 10 }],
    });
  };

  const handleRemoveExercise = (index) => {
    const newExercises = customRoutine.exercises.filter((_, i) => i !== index);
    setCustomRoutine({ ...customRoutine, exercises: newExercises });
  };

  const handleSaveCustomRoutine = () => {
    if (!customRoutine.name.trim()) {
      alert("루틴 이름을 입력해주세요.");
      return;
    }
    const validExercises = customRoutine.exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      alert("최소한 하나의 운동을 추가해주세요.");
      return;
    }

    // 대략적인 칼로리 및 총 시간 계산
    const totalDuration = Math.round(validExercises.length * 5 + (validExercises.length - 1) * 1);
    const totalCalories = Math.round(validExercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * 0.5), 0) + (totalDuration * 5));

    const newRoutine = {
      id: Date.now(),
      title: customRoutine.name,
      exercises: validExercises,
      duration: totalDuration,
      level: customRoutine.level,
      calories: totalCalories,
      isCustom: true,
    };

    setRoutines([...routines, newRoutine]);
    setUserRoutines([...userRoutines, newRoutine]);
    setSelectedRoutine(newRoutine);
    setShowCustomCreator(false);
    setCustomRoutine({ name: "", level: "초급", exercises: [{ name: "", sets: 3, reps: 10 }] });
    alert("루틴이 저장되었습니다!");
  };

  const handleResetCustomRoutine = () => {
    setCustomRoutine({ name: "", level: "초급", exercises: [{ name: "", sets: 3, reps: 10 }] });
    setShowCustomCreator(false);
  };

  const currentExercise = selectedRoutine?.exercises[currentExerciseIndex];
  const progress = selectedRoutine
    ? (completedExercises.length / selectedRoutine.exercises.length) * 100
    : 0;

  return (
    <div className="routine-wrapper">
      {/* ========== 메인 콘텐츠 ========== */}
      <div className="routine-container">
        {/* 페이지 헤더 */}
        <header className="page-header">
          <h1 className="routine-title">나의 운동 루틴</h1>
          <p className="routine-subtitle">루틴을 선택하거나 AI 추천을 받아보세요</p>
        </header>

        {/* 통계 카드 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon violet">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">이번 주 운동</span>
              <span className="stat-value">5<span className="stat-unit">회</span></span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">총 운동 시간</span>
              <span className="stat-value">3:45<span className="stat-unit">시간</span></span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">소모 칼로리</span>
              <span className="stat-value">1,250<span className="stat-unit">kcal</span></span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">연속 운동</span>
              <span className="stat-value">12<span className="stat-unit">일</span></span>
            </div>
          </div>
        </div>

        {/* 탭 선택 */}
        <div className="routine-select-tabs">
          <button
            className={`tab-btn ${tab === 1 ? "active" : ""}`}
            onClick={() => setTab(1)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            루틴 직접 선택
          </button>
          <button
            className={`tab-btn ${tab === 2 ? "active" : ""}`}
            onClick={() => setTab(2)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            AI 트레이너 추천
          </button>
        </div>

        {/* -------------------- 직접 입력 -------------------- */}
        {tab === 1 && (
          <div className="content-box fade">
            {!showCustomCreator ? (
              <>
                <button
                  className="create-routine-btn"
                  onClick={() => setShowCustomCreator(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  나만의 루틴 만들기
                </button>

                <div className="section-header">
                  <h3 className="subtitle">미리 설정된 루틴</h3>
                  <p className="subtext">오늘 진행할 루틴을 선택해 주세요</p>
                </div>

                <div className="routine-list">
                  {routines.filter(r => !r.isCustom).map((routine) => (
                    <div
                      key={routine.id}
                      className={`routine-card ${selectedRoutine?.id === routine.id ? "selected" : ""}`}
                      onClick={() => handleRoutineSelect(routine)}
                    >
                      <div className="routine-card-header">
                        <h4 className="routine-card-title">{routine.title}</h4>
                        <span className={`level-badge ${routine.level === "초급" ? "beginner" : routine.level === "중급" ? "intermediate" : "advanced"}`}>
                          {routine.level}
                        </span>
                      </div>
                      <div className="routine-card-exercises">
                        {routine.exercises.map((ex, idx) => (
                          <span key={idx} className="exercise-tag">{ex.name}</span>
                        ))}
                      </div>
                      <div className="routine-card-meta">
                        <span className="meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {routine.duration}분
                        </span>
                        <span className="meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                          </svg>
                          {routine.calories}kcal
                        </span>
                        <span className="meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6.5 6.5h11v11h-11z"></path>
                            <path d="M3 12h3M18 12h3M12 3v3M12 18v3"></path>
                          </svg>
                          {routine.exercises.length}개 운동
                        </span>
                      </div>
                      <div className="routine-card-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: "0%" }}></div>
                        </div>
                      </div>
                      <button
                        className="start-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoutine(routine);
                          setShowWorkoutModal(true);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        운동 시작
                      </button>
                    </div>
                  ))}
                </div>

                {userRoutines.length > 0 && (
                  <>
                    <div className="section-header">
                      <h3 className="subtitle">나만의 루틴</h3>
                    </div>
                    <div className="routine-list">
                      {userRoutines.map((routine) => (
                        <div
                          key={routine.id}
                          className={`routine-card ${selectedRoutine?.id === routine.id ? "selected" : ""}`}
                          onClick={() => handleRoutineSelect(routine)}
                        >
                          <div className="routine-card-header">
                            <h4 className="routine-card-title">{routine.title}</h4>
                            <span className={`level-badge ${routine.level === "초급" ? "beginner" : routine.level === "중급" ? "intermediate" : "advanced"}`}>
                              {routine.level}
                            </span>
                          </div>
                          <div className="routine-card-exercises">
                            {routine.exercises.map((ex, idx) => (
                              <span key={idx} className="exercise-tag">{ex.name}</span>
                            ))}
                          </div>
                          <div className="routine-card-meta">
                            <span className="meta-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              {routine.duration}분
                            </span>
                            <span className="meta-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                              </svg>
                              {routine.calories}kcal
                            </span>
                            <span className="meta-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6.5 6.5h11v11h-11z"></path>
                                <path d="M3 12h3M18 12h3M12 3v3M12 18v3"></path>
                              </svg>
                              {routine.exercises.length}개 운동
                            </span>
                          </div>
                          <div className="routine-card-progress">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: "0%" }}></div>
                            </div>
                          </div>
                          <button
                            className="start-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoutine(routine);
                              setShowWorkoutModal(true);
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            운동 시작
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              // ========== 사용자 정의 루틴 생성 UI ==========
              <div className="custom-routine-creator">
                <div className="creator-header">
                  <h3 className="subtitle">새 루틴 만들기</h3>
                  <button 
                    className="close-creator-btn"
                    onClick={handleResetCustomRoutine}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="form-group">
                  <label>루틴 이름</label>
                  <input
                    type="text"
                    value={customRoutine.name}
                    onChange={(e) => setCustomRoutine({ ...customRoutine, name: e.target.value })}
                    placeholder="예: 나만의 전신 근력 루틴"
                  />
                </div>

                <div className="form-group">
                  <label>난이도 설정</label>
                  <select 
                    value={customRoutine.level} 
                    onChange={(e) => setCustomRoutine({ ...customRoutine, level: e.target.value })}
                  >
                    <option value="초급">초급</option>
                    <option value="중급">중급</option>
                    <option value="고급">고급</option>
                  </select>
                </div>

                <h4 className="exercise-list-title">운동 목록</h4>
                <div className="exercises-container">
                  {customRoutine.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                      <select
                        value={exercise.name}
                        onChange={(e) => handleCustomExerciseChange(index, "name", e.target.value)}
                        className="exercise-select"
                      >
                        <option value="">운동 선택</option>
                        {EXERCISE_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="exercise-inputs">
                        <div className="input-group">
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => handleCustomExerciseChange(index, "sets", e.target.value)}
                            placeholder="세트"
                            min="1"
                          />
                          <span className="unit">세트</span>
                        </div>
                        <div className="input-group">
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => handleCustomExerciseChange(index, "reps", e.target.value)}
                            placeholder="횟수"
                            min="1"
                          />
                          <span className="unit">회</span>
                        </div>
                      </div>
                      {customRoutine.exercises.length > 1 && (
                        <button 
                          className="remove-btn" 
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button className="add-exercise-btn" onClick={handleAddExercise}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  운동 추가
                </button>

                <div className="action-buttons">
                  <button className="save-btn" onClick={handleSaveCustomRoutine}>
                    루틴 저장
                  </button>
                  <button className="cancel-btn" onClick={handleResetCustomRoutine}>
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- AI 추천 -------------------- */}
        {tab === 2 && (
          <div className="content-box ai fade">
            <div className="section-header">
              <div className="ai-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                AI 맞춤 추천
              </div>
              <h3 className="subtitle">AI 추천을 위한 데이터 선택</h3>
              <p className="subtext">
                어떤 데이터를 기반으로 루틴을 추천받으시겠습니까?
              </p>
            </div>

            <div className="checkbox-group">
              <label className={`checkbox-card ${aiOptions.pastData ? "checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={aiOptions.pastData}
                  onChange={() => handleAiOptionChange("pastData")}
                />
                <div className="checkbox-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                  </svg>
                </div>
                <div className="checkbox-content">
                  <span className="checkbox-title">지난 운동 데이터</span>
                  <span className="checkbox-desc">이전 운동 기록을 분석하여 추천</span>
                </div>
                <div className="checkbox-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </label>

              <label className={`checkbox-card ${aiOptions.bioRhythm ? "checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={aiOptions.bioRhythm}
                  onChange={() => handleAiOptionChange("bioRhythm")}
                />
                <div className="checkbox-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="checkbox-content">
                  <span className="checkbox-title">생체 리듬 (웨어러블)</span>
                  <span className="checkbox-desc">심박수, 수면 패턴 등 분석</span>
                </div>
                <div className="checkbox-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </label>

              <label className={`checkbox-card ${aiOptions.inbody ? "checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={aiOptions.inbody}
                  onChange={() => handleAiOptionChange("inbody")}
                />
                <div className="checkbox-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="checkbox-content">
                  <span className="checkbox-title">인바디 데이터</span>
                  <span className="checkbox-desc">체성분 분석 결과 기반 추천</span>
                </div>
                <div className="checkbox-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </label>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <p>
                선택된 데이터를 기반으로 AI 트레이너가
                <strong> "오늘의 최적 맞춤 루틴" </strong>
                을 생성합니다.
              </p>
            </div>

            <button
              className="ai-btn"
              onClick={handleAiRecommend}
              disabled={!aiOptions.pastData && !aiOptions.bioRhythm && !aiOptions.inbody}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              AI 추천 루틴 확인 및 시작
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ========== 운동 세션 모달 ========== */}
      {showWorkoutModal && selectedRoutine && (
        <div className="workout-modal-overlay">
          <div className="workout-modal">
            {/* 모달 헤더 */}
            <div className="workout-modal-header">
              <div className="workout-modal-title">
                <h2>{selectedRoutine.title}</h2>
                <span className="workout-badge">
                  {completedExercises.length}/{selectedRoutine.exercises.length}
                </span>
              </div>
              <button className="workout-close-btn" onClick={handleCloseWorkout}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* 모달 바디 */}
            <div className="workout-modal-body">
              {/* 카운트다운 화면 */}
              {!workoutStarted ? (
                <div className="workout-ready">
                  <div className="ready-stats">
                    <div className="ready-stat">
                      <span className="ready-stat-value">{selectedRoutine.duration}분</span>
                      <span className="ready-stat-label">예상 시간</span>
                    </div>
                    <div className="ready-stat">
                      <span className="ready-stat-value">{selectedRoutine.calories}kcal</span>
                      <span className="ready-stat-label">예상 칼로리</span>
                    </div>
                    <div className="ready-stat">
                      <span className="ready-stat-value">{selectedRoutine.exercises.length}개</span>
                      <span className="ready-stat-label">운동 수</span>
                    </div>
                  </div>
                  <div className="ready-exercises">
                    <h4>운동 목록</h4>
                    <ul>
                      {selectedRoutine.exercises.map((ex, idx) => (
                        <li key={idx}>
                          <span className="exercise-number">{idx + 1}</span>
                          <span className="exercise-name">{ex.name}</span>
                          <span className="exercise-detail">{ex.sets} x {ex.reps}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="workout-start-btn" onClick={handleStartWorkout}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    운동 시작하기
                  </button>
                </div>
              ) : countdown > 0 ? (
                /* 카운트다운 */
                <div className="countdown-screen">
                  <p className="countdown-label">준비하세요!</p>
                  <div className="countdown-number">{countdown}</div>
                  <p className="countdown-exercise">
                    첫 번째 운동: <strong>{selectedRoutine.exercises[0].name}</strong>
                  </p>
                </div>
              ) : workoutComplete ? (
                /* 운동 완료 */
                <div className="workout-complete-screen">
                  <div className="complete-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                  </div>
                  <h3>운동 완료!</h3>
                  <p className="complete-stats">
                    총 {formatTime(elapsedTime)} 동안 운동했습니다
                  </p>
                  <div className="complete-summary">
                    <div className="summary-item">
                      <span className="summary-value">{selectedRoutine.exercises.length}</span>
                      <span className="summary-label">완료 운동</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-value">{Math.round(elapsedTime * 0.15)}</span>
                      <span className="summary-label">소모 칼로리</span>
                    </div>
                  </div>
                  <button className="workout-finish-btn" onClick={handleCloseWorkout}>
                    완료하고 나가기
                  </button>
                </div>
              ) : isResting ? (
                /* 휴식 시간 */
                <div className="rest-screen">
                  <p className="rest-label">휴식 시간</p>
                  <div className="rest-timer">{formatTime(restTime)}</div>
                  <p className="rest-next">
                    다음 운동: <strong>{selectedRoutine.exercises[currentExerciseIndex]?.name}</strong>
                  </p>
                  <button className="skip-rest-btn" onClick={handleSkipRest}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 4 15 12 5 20 5 4"></polygon>
                      <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                    건너뛰기
                  </button>
                </div>
              ) : (
                /* 운동 진행 중 */
                <div className="exercise-screen">
                  <div className="exercise-timer-bar">
                    <div className="timer-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{formatTime(elapsedTime)}</span>
                    </div>
                  </div>

                  <div className="exercise-content">
                    <div className="exercise-progress">
                      <div className="progress-text">
                        <span className="progress-current">{currentExerciseIndex + 1}</span>
                        <span className="progress-total">/ {selectedRoutine.exercises.length}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <div className="exercise-info">
                      <h3 className="exercise-name">{currentExercise?.name}</h3>
                      <div className="exercise-details">
                        <div className="detail-item">
                          <span className="detail-label">세트</span>
                          <span className="detail-value">{currentExercise?.sets}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">횟수</span>
                          <span className="detail-value">{currentExercise?.reps}</span>
                        </div>
                      </div>
                    </div>

                    <button className="complete-exercise-btn" onClick={handleCompleteExercise}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      운동 완료
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
