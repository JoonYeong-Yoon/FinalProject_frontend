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
  const [rawJsonInput, setRawJsonInput] = useState("");

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

  const secToMinSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
  };

  const getDataFormatGuide = () => {
    if (uploadMode === "health_connect") {
      return `삼성 Health Connect 데이터 형식:
{
  "sleep": 420,
  "steps": 8500,
  "weight": 70500,
  "height": 175,
  "distance": 5400,
  "heartRate": 75,
  "restingHeartRate": 60,
  "calories": 300,
  "totalCaloriesBurned": 2100
}`;
    } else {
      return `Apple HealthKit 데이터 형식:
{
  "sleepHours": 7.0,
  "steps": 8500,
  "weight": 70.5,
  "height": 175,
  "distance": 5.4,
  "heartRate": 75,
  "restingHeartRate": 60,
  "activeEnergy": 300,
  "bmi": 23.0
}`;
    }
  };

  const getDifficultyLabel = (diff) => {
    if (diff <= 2) return "하";
    if (diff === 3) return "중";
    return "상";
  };

  const getDifficultyStyle = (diff) => {
    if (diff <= 2) {
      return {
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        color: "#4ade80",
        padding: "4px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "500",
      };
    } else if (diff === 3) {
      return {
        backgroundColor: "rgba(234, 179, 8, 0.2)",
        color: "#facc15",
        padding: "4px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "500",
      };
    } else {
      return {
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        color: "#f87171",
        padding: "4px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "500",
      };
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🏋️
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #a78bfa, #f9a8d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI 맞춤 운동 추천 서비스
          </h1>
        </div>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
          백엔드 서버: {BACKEND_URL}
        </p>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#f87171" }}>⚠️ 오류: {error}</p>
          </div>
        )}

        {/* Fetch Button */}
        <button
          onClick={fetchLatestData}
          style={{
            marginBottom: "24px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
            border: "none",
            borderRadius: "12px",
            color: "white",
            fontWeight: "500",
            cursor: "pointer",
            boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.25)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #be185d)";
            e.currentTarget.style.boxShadow = "0 6px 20px 0 rgba(139, 92, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #db2777)";
            e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(139, 92, 246, 0.25)";
          }}
        >
          🔄 서버에서 최신 분석 결과 불러오기
        </button>

        {/* Mode Selection */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          <button
            onClick={() => setUploadMode("manual_file")}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: "500",
              cursor: "pointer",
              border: uploadMode === "manual_file" ? "none" : "1px solid #374151",
              background:
                uploadMode === "manual_file"
                  ? "linear-gradient(135deg, #7c3aed, #db2777)"
                  : "#1a1a1a",
              color: "white",
              boxShadow:
                uploadMode === "manual_file"
                  ? "0 4px 14px 0 rgba(139, 92, 246, 0.25)"
                  : "none",
              transition: "all 0.3s",
            }}
          >
            📁 수동 파일 업로드 (ZIP/DB)
          </button>
          <button
            onClick={() => setUploadMode("health_connect")}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: "500",
              cursor: "pointer",
              border: uploadMode === "health_connect" ? "none" : "1px solid #374151",
              background:
                uploadMode === "health_connect"
                  ? "linear-gradient(135deg, #7c3aed, #db2777)"
                  : "#1a1a1a",
              color: "white",
              boxShadow:
                uploadMode === "health_connect"
                  ? "0 4px 14px 0 rgba(139, 92, 246, 0.25)"
                  : "none",
              transition: "all 0.3s",
            }}
          >
            🤖 Health Connect 데이터 입력
          </button>
          <button
            onClick={() => setUploadMode("health_kit")}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: "500",
              cursor: "pointer",
              border: uploadMode === "health_kit" ? "none" : "1px solid #374151",
              background:
                uploadMode === "health_kit"
                  ? "linear-gradient(135deg, #7c3aed, #db2777)"
                  : "#1a1a1a",
              color: "white",
              boxShadow:
                uploadMode === "health_kit"
                  ? "0 4px 14px 0 rgba(139, 92, 246, 0.25)"
                  : "none",
              transition: "all 0.3s",
            }}
          >
            🍎 Apple HealthKit 데이터 입력
          </button>
        </div>

        {/* Settings Card */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "16px",
            border: "1px solid #374151",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ color: "#9ca3af", fontSize: "14px" }}>사용자 ID:</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={{
                  padding: "8px 16px",
                  background: "#0a0a0a",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "white",
                  width: "144px",
                  outline: "none",
                }}
                placeholder="user123"
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ color: "#9ca3af", fontSize: "14px" }}>운동 난이도:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  padding: "8px 16px",
                  background: "#0a0a0a",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "white",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
              >
                <option value="하">하 (초보)</option>
                <option value="중">중 (보통)</option>
                <option value="상">상 (고급)</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ color: "#9ca3af", fontSize: "14px" }}>운동 시간:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{
                  padding: "8px 16px",
                  background: "#0a0a0a",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "white",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
              >
                <option value={10}>10분</option>
                <option value={30}>30분</option>
                <option value={60}>60분</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Section - File */}
        {uploadMode === "manual_file" && (
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "16px",
              border: "1px solid #374151",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              ① ZIP/DB 파일 업로드
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
              삼성 Health Connect에서 내보낸 ZIP 파일을 업로드하세요
            </p>
            <div
              style={{
                border: "2px dashed #4b5563",
                borderRadius: "12px",
                padding: "32px",
                textAlign: "center",
                marginBottom: "20px",
                cursor: "pointer",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#8b5cf6")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#4b5563")}
            >
              <input
                type="file"
                accept=".db,.zip"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📂</div>
                <p style={{ color: "#9ca3af" }}>
                  {file ? file.name : "파일을 선택하거나 드래그하세요"}
                </p>
              </label>
            </div>
            <button
              onClick={handleFileSubmit}
              disabled={!file || loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                fontWeight: "500",
                border: "none",
                background:
                  file && !loading
                    ? "linear-gradient(135deg, #7c3aed, #db2777)"
                    : "#4b5563",
                color: file && !loading ? "white" : "#9ca3af",
                cursor: file && !loading ? "pointer" : "not-allowed",
                boxShadow:
                  file && !loading ? "0 4px 14px 0 rgba(139, 92, 246, 0.25)" : "none",
                transition: "all 0.3s",
              }}
            >
              {loading ? "⏳ 분석 중..." : "🚀 업로드 & 분석"}
            </button>
          </div>
        )}

        {/* Upload Section - JSON */}
        {(uploadMode === "health_connect" || uploadMode === "health_kit") && (
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "16px",
              border: "1px solid #374151",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              ② Health Data JSON 입력
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
              {uploadMode === "health_connect"
                ? "삼성 Health Connect에서 추출한 JSON 데이터를 입력하세요"
                : "Apple HealthKit에서 추출한 JSON 데이터를 입력하세요"}
            </p>

            <details
              style={{
                marginBottom: "20px",
                background: "#0a0a0a",
                borderRadius: "12px",
                border: "1px solid #374151",
              }}
            >
              <summary
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  color: "#a78bfa",
                  fontWeight: "500",
                }}
              >
                📖 데이터 형식 가이드 (클릭하여 펼치기)
              </summary>
              <pre
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  color: "#9ca3af",
                  overflowX: "auto",
                  margin: 0,
                }}
              >
                {getDataFormatGuide()}
              </pre>
            </details>

            <textarea
              placeholder={`실제 건강 데이터를 JSON 형식으로 입력하세요...\n\n위의 "데이터 형식 가이드"를 참고하세요.`}
              value={rawJsonInput}
              onChange={(e) => setRawJsonInput(e.target.value)}
              style={{
                width: "100%",
                height: "320px",
                padding: "16px",
                background: "#0a0a0a",
                border: "1px solid #4b5563",
                borderRadius: "12px",
                color: "#4ade80",
                fontFamily: "monospace",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                marginBottom: "20px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
              onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
            />

            <button
              onClick={handleAutoSubmit}
              disabled={!rawJsonInput || loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                fontWeight: "500",
                border: "none",
                background:
                  rawJsonInput && !loading
                    ? "linear-gradient(135deg, #7c3aed, #db2777)"
                    : "#4b5563",
                color: rawJsonInput && !loading ? "white" : "#9ca3af",
                cursor: rawJsonInput && !loading ? "pointer" : "not-allowed",
                boxShadow:
                  rawJsonInput && !loading
                    ? "0 4px 14px 0 rgba(139, 92, 246, 0.25)"
                    : "none",
                transition: "all 0.3s",
              }}
            >
              {loading ? "⏳ 분석 중..." : "🚀 데이터 전송 & 분석"}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                padding: "32px",
                background: "#1a1a1a",
                borderRadius: "16px",
                border: "1px solid #374151",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              >
                🤖
              </div>
              <p style={{ fontSize: "18px", fontWeight: "500", margin: 0 }}>
                AI가 건강 데이터를 분석 중입니다...
              </p>
              <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "8px" }}>
                잠시만 기다려 주세요!
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={{ marginTop: "32px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "24px",
                background: "linear-gradient(135deg, #a78bfa, #f9a8d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              📊 분석 결과
            </h2>

            {/* Analysis Text */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "16px",
                border: "1px solid #374151",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  💬
                </span>
                AI 분석
              </h3>
              <div
                style={{
                  background: "#0a0a0a",
                  borderRadius: "12px",
                  padding: "20px",
                  color: "#d1d5db",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  border: "1px solid #374151",
                }}
              >
                {result.llm_result?.analysis ?? "❌ 분석 결과 없음"}
              </div>
            </div>

            {/* Exercise Routine */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "16px",
                border: "1px solid #374151",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  💪
                </span>
                AI 추천 운동 루틴
              </h3>

              {result.llm_result?.ai_recommended_routine ? (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(219, 39, 119, 0.2))",
                        borderRadius: "12px",
                        padding: "16px",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                      }}
                    >
                      <p style={{ color: "#9ca3af", fontSize: "14px" }}>총 운동 시간</p>
                      <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
                        {result.llm_result.ai_recommended_routine.total_time_min}
                        <span style={{ fontSize: "18px", color: "#9ca3af", marginLeft: "4px" }}>
                          분
                        </span>
                      </p>
                    </div>
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(219, 39, 119, 0.2), rgba(251, 146, 60, 0.2))",
                        borderRadius: "12px",
                        padding: "16px",
                        border: "1px solid rgba(236, 72, 153, 0.3)",
                      }}
                    >
                      <p style={{ color: "#9ca3af", fontSize: "14px" }}>예상 소모 칼로리</p>
                      <p style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
                        {result.llm_result.ai_recommended_routine.total_calories}
                        <span style={{ fontSize: "18px", color: "#9ca3af", marginLeft: "4px" }}>
                          kcal
                        </span>
                      </p>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #374151" }}>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 16px",
                              color: "#9ca3af",
                              fontWeight: "500",
                            }}
                          >
                            운동명
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "12px 16px",
                              color: "#9ca3af",
                              fontWeight: "500",
                            }}
                          >
                            난이도
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "12px 16px",
                              color: "#9ca3af",
                              fontWeight: "500",
                            }}
                          >
                            MET
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "12px 16px",
                              color: "#9ca3af",
                              fontWeight: "500",
                            }}
                          >
                            운동시간
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "12px 16px",
                              color: "#9ca3af",
                              fontWeight: "500",
                            }}
                          >
                            휴식시간
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "12px 16px",
                              color: "#9ca3af",
                              fontWeight: "500",
                            }}
                          >
                            세트수
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.llm_result.ai_recommended_routine.items?.map((item, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: "1px solid rgba(55, 65, 81, 0.5)",
                              transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.05)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "transparent")
                            }
                          >
                            <td style={{ padding: "16px", fontWeight: "500" }}>
                              {exerciseNameKo[item.exercise_name] ?? item.exercise_name}
                            </td>
                            <td style={{ padding: "16px", textAlign: "center" }}>
                              <span style={getDifficultyStyle(item.difficulty)}>
                                {getDifficultyLabel(item.difficulty)}
                              </span>
                            </td>
                            <td style={{ padding: "16px", textAlign: "center", color: "#d1d5db" }}>
                              {item.met}
                            </td>
                            <td style={{ padding: "16px", textAlign: "center", color: "#d1d5db" }}>
                              {secToMinSec(item.duration_sec)}
                            </td>
                            <td style={{ padding: "16px", textAlign: "center", color: "#d1d5db" }}>
                              {secToMinSec(item.rest_sec)}
                            </td>
                            <td style={{ padding: "16px", textAlign: "center" }}>
                              <span style={{ color: "#a78bfa", fontWeight: "500" }}>
                                {item.set_count}회
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#f87171" }}>❌ 운동 루틴을 생성하지 못했습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;