import React, { useState, useRef, useEffect } from "react";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 사용자 이메일 가져오기
  const getLoggedInEmail = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.email || "test123";
      }
    } catch (e) {
      console.error("사용자 정보 파싱 오류:", e);
    }
    return "test123";
  };

  const [userId, setUserId] = useState(getLoggedInEmail);
  const [difficulty, setDifficulty] = useState("중");
  const [duration, setDuration] = useState(30);
  const [uploadMode, setUploadMode] = useState("manual_file");
  const [watchType, setWatchType] = useState("galaxy");
  const [serverData, setServerData] = useState(null);  // 서버에서 받아온 데이터

  // 컴포넌트 마운트 시 로그인 이메일 다시 확인
  useEffect(() => {
    const email = getLoggedInEmail();
    if (email !== userId) {
      setUserId(email);
    }
  }, []);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("default");

  // 파일 입력 ref 추가
  const fileInputRef = useRef(null);

  const BACKEND_URL = "http://192.168.0.38:8001";

  const exerciseNameKo = {
    "standing side crunch": "스탠딩 사이드 크런치",
    "standing knee up": "스탠딩 니 업",
    "burpee test": "버피 테스트",
    "step forward dynamic lunge": "전방 런지",
    "step backward dynamic lunge": "후방 런지",
    "side lunge": "사이드 런지",
    "cross lunge": "크로스 런지",
    "good morning exercise": "굿모닝 운동",
    "lying leg raise": "레그레이즈",
    crunch: "크런치",
    "bicycle crunch": "바이시클 크런치",
    "scissor cross": "시저스 크로스",
    "hip thrust": "힙 쓰러스트",
    plank: "플랭크",
    "push up": "푸시업",
    "knee push up": "니 푸시업",
    "Y-exercise": "Y-운동",
  };

  const characters = [
    { id: "default", name: "💪 헬스 코치 지니", specialty: "종합 피트니스", color: "#ec4899" },
    { id: "trainer", name: "🏋️ 근육맨 트레이너", specialty: "근력/벌크업", color: "#3b82f6" },
    { id: "yoga", name: "🧘 요가 마스터 수련", specialty: "유연성/명상", color: "#22c55e" },
    { id: "cardio", name: "🏃 유산소 전문가", specialty: "유산소/심폐지구력", color: "#f97316" },
    { id: "diet", name: "🥗 영양사 민희", specialty: "식단/영양", color: "#a855f7" },
  ];

  const callApi = async (url, options) => {
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(url, options);
      const responseBody = await response.text();

      if (!response.ok) {
        throw new Error(`서버 응답 오류 (${response.status}): ${responseBody}`);
      }

      let data;
      try {
        data = JSON.parse(responseBody);
      } catch (e) {
        throw new Error(`JSON 파싱 실패: ${responseBody}`);
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleFileSubmit = async () => {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    const validUserId = userId && userId.trim() ? userId : "test123";
    const formData = new FormData();
    formData.append("file", file);

    const url = `${BACKEND_URL}/api/file/upload?user_id=${validUserId}&difficulty=${difficulty}&duration=${duration}`;

    await callApi(url, {
      method: "POST",
      body: formData,
    });
  };

  // 서버에서 앱이 보낸 최신 데이터 받아오기 (데이터 전송만)
  const fetchServerData = async () => {
    const validUserId = userId && userId.trim() ? userId : "test123";
    
    setLoading(true);
    setError(null);
    
    try {
      // 서버에서 최신 데이터 조회
      const url = `${BACKEND_URL}/api/app/latest?user_id=${validUserId}&watch_type=${watchType}`;
      
      const response = await fetch(url);
      const responseBody = await response.text();
      
      if (!response.ok) {
        throw new Error(`서버 응답 오류 (${response.status}): ${responseBody}`);
      }
      
      const data = JSON.parse(responseBody);
      
      if (data && data.success) {
        setServerData(data);  // 서버 데이터 수신 완료 표시
        alert("✅ 서버에서 데이터를 성공적으로 받아왔습니다. '분석하기' 버튼을 눌러주세요.");
      } else {
        throw new Error(data.detail || "데이터를 받아오지 못했습니다.");
      }
    } catch (err) {
      setError(err.message);
      setServerData(null);
    }
    
    setLoading(false);
  };

  // 서버에서 앱이 보낸 최신 데이터 받아와서 분석까지 실행
  const handleFetchFromServer = async () => {
    const validUserId = userId && userId.trim() ? userId : "test123";
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // 기존 API 사용: /api/user/latest-analysis
      // 앱에서 보낸 최신 데이터를 조회하고 AI 분석까지 한번에 실행
      const url = `${BACKEND_URL}/api/user/latest-analysis?user_id=${validUserId}&difficulty=${difficulty}&duration=${duration}`;
      
      const response = await fetch(url);
      const responseBody = await response.text();
      
      if (!response.ok) {
        throw new Error(`서버 응답 오류 (${response.status}): ${responseBody}`);
      }
      
      const data = JSON.parse(responseBody);
      
      if (data && data.success) {
        // 결과를 file_upload_service와 동일한 형식으로 변환
        setResult({
          llm_result: {
            analysis: data.analysis,
            ai_recommended_routine: data.ai_recommended_routine,
          },
          summary: data.summary,
          date: data.date,
        });
        setServerData(data);  // 서버 데이터 수신 완료 표시
      } else {
        throw new Error(data.detail || "데이터를 받아오지 못했습니다.");
      }
    } catch (err) {
      setError(err.message);
      setServerData(null);
    }
    
    setLoading(false);
  };

  const fetchLatestData = async () => {
    const validUserId = userId && userId.trim() ? userId : "test123";
    const url = `${BACKEND_URL}/api/user/latest-summary?user_id=${validUserId}`;

    await callApi(url, { method: "GET" });
  };

  const handleAnalyze = () => {
    if (uploadMode === "manual_file") {
      handleFileSubmit();
    } else {
      // app_upload 모드: 서버에서 데이터 받아오기 + 분석 한번에 실행
      handleFetchFromServer();
    }
  };

  // 파일 업로드 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const secToMinSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}초`;
    if (s === 0) return `${m}분`;
    return `${m}분 ${s}초`;
  };

  // 고정형 질문 핸들러 (백엔드 /api/chat/fixed 호출)
  const handleFixedQuestion = async (questionType) => {
    const validUserId = userId && userId.trim() ? userId : "test123";
    
    // 사용자 메시지 추가 (UI 표시용)
    const questionLabels = {
      // 기존 건강 분석 6개
      weekly_report: "📊 이번 주 건강 리포트 보여줘",
      today_recommendation: "🏋️ 오늘 운동 추천해줘",
      weekly_steps: "👟 지난주 걸음수 분석해줘",
      sleep_report: "😴 수면 패턴 분석해줘",
      heart_rate: "❤️ 심박수 분석해줘",
      health_score: "🏅 건강 점수 알려줘",
      // 목표별 운동 추천 5개
      muscle_gain: "💪 근육 증가 목표로 운동 추천해줘",
      diet_goal: "🔥 다이어트 목표로 운동 추천해줘",
      endurance: "🏃 지구력 향상 목표로 운동 추천해줘",
      flexibility: "🧘 유연성 향상 목표로 운동 추천해줘",
      mindfulness: "🧠 마음챙김/스트레스 해소 운동 추천해줘",
    };
    
    const userMessage = questionLabels[questionType] || questionType;
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/fixed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: validUserId,
          question_type: questionType,
          character: selectedCharacter,
        }),
      });
      
      const data = await response.json();
      const botMessage = data.response || data.message || "응답을 받지 못했습니다.";
      setChatMessages(prev => [...prev, { role: "assistant", content: botMessage }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `⚠️ 오류: ${err.message}` }]);
    }
  };

  // 자유형 채팅 핸들러 (백엔드 /api/chat 호출)
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const validUserId = userId && userId.trim() ? userId : "test123";
    const userMessage = chatInput;
    
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: validUserId,
          message: userMessage,
          character: selectedCharacter,
        }),
      });
      
      const data = await response.json();
      const botMessage = data.response || data.message || "응답을 받지 못했습니다.";
      setChatMessages(prev => [...prev, { role: "assistant", content: botMessage }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `⚠️ 오류: ${err.message}` }]);
    }
  };

  const getMETBadgeColor = (met) => {
    if (met <= 3) return "bg-green-100 text-green-700";
    if (met <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      color: "white",
      padding: window.innerWidth >= 768 ? "1px" : "16px"
    }}>
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        accept=".db,.zip"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(to bottom right, #a855f7, #ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px"
          }}>
            🦌
          </div>
          <h1 style={{
            fontSize: window.innerWidth >= 768 ? "24px" : "20px",
            fontWeight: "bold",
            background: "linear-gradient(to right, #c084fc, #f9a8d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            웨어러블 데이터 기반 운동 추천 서비스
          </h1>
        </div>

        {/* Mode Selection Tabs */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px"
        }}>
          <button
            onClick={() => setUploadMode("manual_file")}
            style={{
              padding: "10px 24px",
              borderRadius: "9999px",
              fontWeight: "500",
              fontSize: "14px",
              transition: "all 0.3s",
              background: uploadMode === "manual_file" 
                ? "linear-gradient(to right, #741711ff 0%, #3d0909ff 100%)" 
                : "#1a1a1a",
              border: uploadMode === "manual_file" ? "none" : "1px solid #4b5563",
              color: "white",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              if (uploadMode !== "manual_file") e.currentTarget.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              if (uploadMode !== "manual_file") e.currentTarget.style.borderColor = "#4b5563";
            }}
          >
            파일 업로드 (.zip/.db)
          </button>
          <button
            onClick={() => setUploadMode("app_upload")}
            style={{
              padding: "10px 24px",
              borderRadius: "9999px",
              fontWeight: "500",
              fontSize: "14px",
              transition: "all 0.3s",
              background: uploadMode === "app_upload" 
                ? "linear-gradient(to right,  #741711ff 0%, #3d0909ff 100%)"
                : "#1a1a1a",
              border: uploadMode === "app_upload" ? "none" : "1px solid #63524bff",
              color: "white",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              if (uploadMode !== "app_upload") e.currentTarget.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              if (uploadMode !== "app_upload") e.currentTarget.style.borderColor = "#4b5563";
            }}
          >
            앱에서 전송 (JSON)
          </button>
        </div>

        {/* Control Bar */}
        <div style={{
          background: "linear-gradient(135deg, #11115c23 0%, #09043817 100%)",
          border: "1px solid #cf0b0bff",
          borderRadius: "12px",
          padding: "16px 50px",
          marginBottom: "24px"
          }}>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15x"
          }}>
            {/* 모드별 버튼 - 파일 업로드 또는 서버 데이터 전송 */}
            {uploadMode === "manual_file" ? (
              <button
                onClick={handleFileButtonClick}
                style={{
                  padding: "8px 16px",
                  background: file ? "linear-gradient(to right, #10b981, #059669)" : "#0d0d0d",
                  border: file ? "none" : "4px solid #7a3d96ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: file ? "white" : "#d1d5db",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  minWidth: "145px"
                }}
                onMouseEnter={(e) => {
                  if (!file) {
                    e.currentTarget.style.borderColor = "#c084fc";
                    e.currentTarget.style.color = "#c084fc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!file) {
                    e.currentTarget.style.borderColor = "#4b5563";
                    e.currentTarget.style.color = "#d1d5db";
                  }
                }}
              >
                {file ? (
                  <>
                    ✅ {file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name}
                  </>
                ) : (
                  <>
                    파일 업로드<br/>(클릭하세요)
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={fetchServerData}
                style={{
                  padding: "8px 16px",
                  background: serverData ? "linear-gradient(to right, #10b981, #059669)" : "#0d0d0d",
                  border: serverData ? "none" : "4px solid #7a3d96ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: serverData ? "white" : "#d1d5db",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  minWidth: "140px"
                }}
                onMouseEnter={(e) => {
                  if (!serverData) {
                    e.currentTarget.style.borderColor = "#c084fc";
                    e.currentTarget.style.color = "#c084fc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!serverData) {
                    e.currentTarget.style.borderColor = "#4b5563";
                    e.currentTarget.style.color = "#d1d5db";
                  }
                }}
              >
                {serverData ? (
                  <>✅ 데이터 수신 완료</>
                ) : (
                  <>서버에서 데이터 전송<br/>(클릭하세요)</>
                )}
              </button>
            )}

            {uploadMode === "app_upload" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#9ca3af", fontSize: "14px" }}>워치 종류:</span>
                <select
                  value={watchType}
                  onChange={(e) => setWatchType(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    background: "#0d0d0d",
                    border: "1px solid #4b5563",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                >
                  <option value="galaxy">갤럭시워치</option>
                  <option value="apple">애플워치</option>
                </select>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}>운동 난이도:</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  padding: "6px 12px",
                  background: "#0d0d0d",
                  border: "1px solid #4b5563",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"                 
                }}
              >
                <option value="하">하(쉬움)</option>
                <option value="중">중(보통)</option>
                <option value="상">상(어려움)</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}>운동 시간:</span>
              <select
                value={duration.toString()}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{
                  padding: "6px 12px",
                  background: "#0d0d0d",
                  border: "1px solid #4b5563",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
              >
                <option value="10">10분</option>
                <option value="30">30분</option>
                <option value="60">60분</option>
              </select>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                padding: "8px 24px",
                background: loading
                  ? "#4b5563"
                  : "linear-gradient(to right, #eab308, #f59e0b)",
                border: "none",
                borderRadius: "8px",
                color: loading ? "#9ca3af" : "#000",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s"
              }}
            >
              {loading ? "분석 중..." : "분석하기"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(127, 29, 29, 0.3)",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px"
          }}>
            <p style={{ color: "#f87171" }}>⚠️ 오류: {error}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth >= 1024 ? "1fr 1fr 400px" : "1fr",
          gap: "24px"
        }}>
          {/* AI Analysis Card */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #1e1e30 100%)",
            border: "1px solid #80220bff",
            color: "white",
            borderRadius: "16px",
            padding: "0",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            {/* 제목 헤더 */} 
            <div style={{
              background: "linear-gradient(135deg, #741711ff 0%, #3d0909ff 100%)",
              padding: "14px 20px",
              borderBottom: "1px solid #80220bff"
            }}>
              <h3 style={{
                fontWeight: "bold",
                fontSize: "16px",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff"
              }}>
                <span>🤖</span> 웨어러블 데이터 AI 분석
              </h3>
            </div>           
        
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    border: "2px solid #a855f7",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></div>
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}} />
                </div>
              ) : result?.llm_result?.analysis ? (
                <div style={{
                  fontSize: "14px",
                  color: "#d1d5db",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  maxHeight: "500px",
                  overflowY: "auto",
                  background: "#0f1f0a",
                  padding: "16px",
                  borderRadius: "8px"
                }}>
                  {result.llm_result.analysis}
                </div>
              ) : (
                <p style={{ color: "#6b7280", fontSize: "14px", padding: "60px 20px", textAlign: "center" }}>
                  데이터를 업로드하고 분석하기를 클릭하세요
                </p>
              )}
          </div>

          {/* Exercise Routine Card */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #1e1e30 100%)",
            border: "1px solid #80220bff",
            color: "white",
            borderRadius: "16px",
            padding: "0",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            {/* 제목 헤더 */}
            <div style={{
              background: "linear-gradient(135deg,  #741711ff 0%, #3d0909ff 100%)",
              padding: "14px 20px",
              borderBottom: "1px solid #80220bff"
            }}>
              <h3 style={{
                fontWeight: "bold",
                fontSize: "16px",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff"
              }}>
                <span>🔥</span> 맞춤 운동 루틴
              </h3>
            </div>

              {result?.llm_result?.ai_recommended_routine ? (
                <>
                  {/* Stats Cards */}
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    height:"90px",
                    marginTop: "20px",
                    marginBottom: "20px"
                  }}>
                    <div style={{
                      alignItems: "center",
                      background: "linear-gradient(to bottom right, #d82626ff, #720505ff)",
                      borderRadius: "10px",
                      padding: "22px 5px",
                      lineHeight: "0.7",
                      textAlign: "center",
                      color: "white",
                      flex: "1 1 0",
                      maxWidth: "110px"           
                    }}>
                      <p style={{ fontSize: "22px", fontWeight: "bold", margin: "2px 0 0 0" }}>
                        {result.llm_result.ai_recommended_routine.total_time_min}분
                      </p>
                      <p style={{ fontSize: "12px", opacity: 0.9 }}>총 운동 시간</p>
                    </div>

                    <div style={{
                      alignItems: "center",
                      background: "linear-gradient(to bottom right, #2d66cfff, #04244bff)",
                      borderRadius: "10px",
                      padding: "22px 12px",
                      lineHeight: "0.7",
                      textAlign: "center",
                      color: "white",
                      flex: "1 1 0",
                      maxWidth: "110px"
                    }}>
                      <p style={{ fontSize: "22px", fontWeight: "bold", margin: "2px 0 0 0" }}>
                        {result.llm_result.ai_recommended_routine.items?.length || 0}개
                      </p>
                      <p style={{ fontSize: "12px", opacity: 0.9 }}>운동 종목 수</p>
                    </div>

                    <div style={{
                      alignItems: "center",
                      background: "linear-gradient(to bottom right, #91680fff, #532703ff)",
                      borderRadius: "10px",
                      padding: "22px 12px",
                      lineHeight: "0.7",
                      textAlign: "center",
                      color: "white",
                      flex: "1 1 0",
                      maxWidth: "110px" 
                    }}>
                      <p style={{ fontSize: "22px", fontWeight: "bold", margin: "2px 0 0 0" }}>
                        {result.llm_result.ai_recommended_routine.total_calories}kcal
                      </p>
                      <p style={{ fontSize: "12px", opacity: 0.9 }}>예상 소모 칼로리</p>
                    </div>                    
                  </div>

                  {/* Exercise List */}
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <h4 style={{ fontWeight: "600", color: "#9ca3af", fontSize: "15px", marginTop: "8px", marginBottom: "12px", paddingLeft: "8px" }}>
                      운동 상세
                    </h4>
                    {result.llm_result.ai_recommended_routine.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#0d0d0d",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #374151",
                          marginBottom: "10px"
                        }}
                      >
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px"
                        }}>
                          <span style={{ fontWeight: "600", color: "#e5e7eb", fontSize: "14px" }}>
                            {idx + 1}. {exerciseNameKo[item.exercise_name] ?? item.exercise_name}
                          </span>
                          <span style={{
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "600",
                            ...(() => {
                              const met = item.met;
                              if (met <= 3) return { background: "rgba(34, 197, 94, 0.2)", color: "#4ade80" };
                              if (met <= 5) return { background: "rgba(234, 179, 8, 0.2)", color: "#fbbf24" };
                              return { background: "rgba(239, 68, 68, 0.2)", color: "#f87171" };
                            })()
                          }}>
                            MET {item.met}
                          </span>
                        </div>
                        <div style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "12px",
                          fontSize: "12px",
                          color: "#9ca3af"
                        }}>
                          <span>세트: {item.set_count}회</span>
                          <span>운동: {secToMinSec(item.duration_sec)}</span>
                          <span>휴식: {secToMinSec(item.rest_sec)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: "#6b7280", fontSize: "14px", padding: "60px 20px", textAlign: "center" }}>
                  분석 후 운동 루틴이 표시됩니다
                </p>
              )}
          </div>

          {/* Right Column - Chat Panel */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #2a1a3e 100%)",
            borderRadius: "16px",
            border: "1px solid #0e5c0bff",
            display: "flex",
            flexDirection: "column",
            height: "600px",
            overflow: "hidden"
          }}>
            {/* 제목 헤더 */}
            <div style={{
              background: "linear-gradient(135deg, #043d11ff 0%, #071f02ff 100%)",
              padding: "14px 20px",
              borderBottom: "1px solid #0e5c0bff"
            }}>
              <h3 style={{
                fontWeight: "bold",
                fontSize: "16px",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff"
              }}>
                💬 피트니스 챗봇
              </h3>
            </div>
            {/* Character Selection */}
            <div style={{
              padding: "16px",
              borderBottom: "1px solid #0e5c0bff",
              background: "#0f1f0a"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px"
              }}>
                <span style={{ fontSize: "14px", color: "#9ca3af" }}>캐릭터 선택:</span>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    background: "#0d0d0d",
                    border: "1px solid #4b5563",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                >
                  {characters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Fixed Question Buttons - 기존 분석 6개 + 목표별 추천 5개 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  // 기존 건강 분석 6개
                  { label: "주간 리포트", type: "weekly_report" },
                  // { label: "주간 걸음수", type: "weekly_steps" },
                  { label: "수면 분석", type: "sleep_report" },
                  // { label: "심박수 분석", type: "heart_rate" },
                  // { label: "건강점수", type: "health_score" },
                  { label: "오늘 운동 추천", type: "today_recommendation" },
                  // 목표별 운동 추천 5개
                  { label: "근육증가 운동추천", type: "muscle_gain" },
                  // { label: "다이어트 운동추천", type: "diet_goal" },
                  // { label: "지구력증가 운동추천", type: "endurance" },
                  // { label: "유연성향상 운동추천", type: "flexibility" },
                  // { label: "마음챙김 운동추천", type: "mindfulness" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFixedQuestion(item.type)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      background: "#1b6904d8",
                      border: "1px solid #272727ff",
                      color: "#d1d5db"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#044107ff";
                      e.currentTarget.style.borderColor = "#0e5c0bff"
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#374151";
                      e.currentTarget.style.borderColor = "#15bb2bff";
                      e.currentTarget.style.color = "#d1d5db";
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#0a0a0a"
            }}>
              {chatMessages.length === 0 ? (
                <p style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  textAlign: "center",
                  paddingTop: "40px",
                  paddingBottom: "40px"
                }}>
                  AI 코치에게 질문해보세요!
                </p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      marginBottom: "12px",
                      background: msg.role === "user" ? "#9333ea" : "#374151",
                      color: msg.role === "user" ? "white" : "#e5e7eb",
                      marginLeft: msg.role === "user" ? "32px" : "0",
                      marginRight: msg.role === "user" ? "0" : "32px"
                    }}
                  >
                    {msg.content}
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div style={{
              padding: "16px",
              borderTop: "1px solid #0b5c1dff",              
              background: "#0f1f0a"
            }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="무엇을 질문하시겠어요..."
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#0d0d0d",
                    border: "1px solid #4b5563",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleSendChat}
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(to right, #0a4408ff)",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px"
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
