import React, { useState } from "react";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState("test123");
  const [difficulty, setDifficulty] = useState("중");
  const [duration, setDuration] = useState(30);
  const [uploadMode, setUploadMode] = useState("manual_file");
  const [watchType, setWatchType] = useState("galaxy");
  const [rawJsonInput, setRawJsonInput] = useState("");
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("default");

  const BACKEND_URL = "http://localhost:8001";

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
    { id: "default", name: "헬스 코치 지니", color: "bg-pink-500" },
    { id: "trainer", name: "근육맨 트레이너", color: "bg-blue-500" },
    { id: "yoga", name: "요가 마스터", color: "bg-green-500" },
    { id: "cardio", name: "유산소 전문가", color: "bg-orange-500" },
    { id: "diet", name: "영양사 민희", color: "bg-purple-500" },
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

  const handleAutoSubmit = async () => {
    let parsedJson;

    try {
      parsedJson = JSON.parse(rawJsonInput);
    } catch (e) {
      alert("❌ JSON 파싱 오류: 올바른 JSON 형식인지 확인하세요.");
      return;
    }

    const validUserId = userId && userId.trim() ? userId : "test123";

    const body = {
      user_id: validUserId,
      raw_json: parsedJson,
      summary: null,
      difficulty,
      duration,
    };

    const url = `${BACKEND_URL}/api/auto/upload`;

    await callApi(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
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
      handleAutoSubmit();
    }
  };

  const secToMinSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}초`;
    if (s === 0) return `${m}분`;
    return `${m}분 ${s}초`;
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: "user", content: chatInput }]);
    setChatInput("");
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
      padding: window.innerWidth >= 768 ? "24px" : "16px"
    }}>
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
                ? "linear-gradient(to right, #ec4899, #d946ef)" 
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
            zip/db 데이터 파일 업로드
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
                ? "linear-gradient(to right, #8b5cf6, #3b82f6)" 
                : "#1a1a1a",
              border: uploadMode === "app_upload" ? "none" : "1px solid #4b5563",
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
            워치 데이터 앱 전송
          </button>
        </div>

        {/* Control Bar */}
        <div style={{
          background: "#1a1a1a",
          border: "1px solid #374151",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px"
        }}>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "16px"
          }}>
            <button
              onClick={fetchLatestData}
              style={{
                padding: "8px 16px",
                background: "#0d0d0d",
                border: "1px solid #4b5563",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#d1d5db",
                transition: "all 0.3s",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c084fc";
                e.currentTarget.style.color = "#c084fc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#4b5563";
                e.currentTarget.style.color = "#d1d5db";
              }}
            >
              파일 업로드<br/>(클릭하세요)
            </button>

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
              disabled={loading || (uploadMode === "manual_file" ? !file : !rawJsonInput)}
              style={{
                padding: "8px 24px",
                background: loading || (uploadMode === "manual_file" ? !file : !rawJsonInput)
                  ? "#4b5563"
                  : "linear-gradient(to right, #eab308, #f59e0b)",
                border: "none",
                borderRadius: "8px",
                color: loading || (uploadMode === "manual_file" ? !file : !rawJsonInput) ? "#9ca3af" : "#000",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading || (uploadMode === "manual_file" ? !file : !rawJsonInput) ? "not-allowed" : "pointer",
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

        {/* File Upload Section (when manual_file mode) */}
        {uploadMode === "manual_file" && (
          <div style={{
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #374151",
            padding: "16px",
            marginBottom: "24px"
          }}>
            <div style={{
              border: "2px dashed #4b5563",
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
              transition: "border-color 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#a855f7"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#4b5563"}>
              <input
                type="file"
                accept=".db,.zip"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📁</div>
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                  {file ? file.name : "ZIP/DB 파일을 선택하세요"}
                </p>
              </label>
            </div>
          </div>
        )}

        {/* JSON Input Section */}
        {uploadMode === "app_upload" && (
          <div style={{
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #374151",
            padding: "16px",
            marginBottom: "24px"
          }}>
            <textarea
              placeholder="Health Data JSON을 입력하세요..."
              value={rawJsonInput}
              onChange={(e) => setRawJsonInput(e.target.value)}
              style={{
                width: "100%",
                height: "128px",
                padding: "12px",
                background: "#0d0d0d",
                border: "1px solid #4b5563",
                borderRadius: "8px",
                color: "#4ade80",
                fontFamily: "monospace",
                fontSize: "14px",
                resize: "none",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#a855f7"}
              onBlur={(e) => e.target.style.borderColor = "#4b5563"}
            />
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
              background: "#1a1a1a",
              border: "1px solid #374151",
              color: "white",
              borderRadius: "12px",
              padding: "20px",
              height: "fit-content"
            }}>
              <h3 style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#e5e7eb"
              }}>
                <span>🤖</span> AI 분석
              </h3>
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
                  background: "#0d0d0d",
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
              background: "#1a1a1a",
              border: "1px solid #374151",
              color: "white",
              borderRadius: "12px",
              padding: "20px"
            }}>
              <h3 style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#e5e7eb"
              }}>
                <span>🔥</span> 맞춤 운동 루틴
              </h3>

              {result?.llm_result?.ai_recommended_routine ? (
                <>
                  {/* Stats Cards */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "20px"
                  }}>
                    <div style={{
                      background: "linear-gradient(to bottom right, #facc15, #fb923c)",
                      borderRadius: "12px",
                      padding: "12px",
                      textAlign: "center",
                      color: "white"
                    }}>
                      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {result.llm_result.ai_recommended_routine.total_time_min}분
                      </p>
                      <p style={{ fontSize: "12px", opacity: 0.9 }}>총 운동 시간</p>
                    </div>
                    <div style={{
                      background: "linear-gradient(to bottom right, #f472b6, #ef4444)",
                      borderRadius: "12px",
                      padding: "12px",
                      textAlign: "center",
                      color: "white"
                    }}>
                      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {result.llm_result.ai_recommended_routine.total_calories}
                      </p>
                      <p style={{ fontSize: "12px", opacity: 0.9 }}>예상 칼로리 소모</p>
                    </div>
                    <div style={{
                      background: "linear-gradient(to bottom right, #c084fc, #60a5fa)",
                      borderRadius: "12px",
                      padding: "12px",
                      textAlign: "center",
                      color: "white"
                    }}>
                      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {result.llm_result.ai_recommended_routine.items?.length || 0}개
                      </p>
                      <p style={{ fontSize: "12px", opacity: 0.9 }}>운동 종목 수</p>
                    </div>
                  </div>

                  {/* Exercise List */}
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <h4 style={{ fontWeight: "600", color: "#9ca3af", fontSize: "13px", marginBottom: "12px" }}>
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
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #374151",
            display: "flex",
            flexDirection: "column",
            height: "600px"
          }}>
            {/* Character Selection */}
            <div style={{
              padding: "16px",
              borderBottom: "1px solid #374151"
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
              
              {/* Character Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["근육 증가 목표", "다이어트", "지구력 향상", "유연성", "마음챙김"].map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      background: idx === 0 ? "#9333ea" : "#374151",
                      color: idx === 0 ? "white" : "#d1d5db"
                    }}
                    onMouseEnter={(e) => {
                      if (idx !== 0) e.currentTarget.style.background = "#4b5563";
                    }}
                    onMouseLeave={(e) => {
                      if (idx !== 0) e.currentTarget.style.background = "#374151";
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto"
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
              borderTop: "1px solid #374151"
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
                    background: "linear-gradient(to right, #9333ea, #db2777)",
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