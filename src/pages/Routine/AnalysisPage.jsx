import React, { useState } from "react";

const BACKEND_URL = "http://localhost:8001";

export default function AnalysisPage() {
  const [difficulty, setDifficulty] = useState("중");
  const [duration, setDuration] = useState(30);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("user");

  const fetchAnalysis = async () => {
    if (!userId.trim()) {
      setError("User ID를 입력해주세요");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/user/latest-analysis?user_id=${userId}&difficulty=${difficulty}&duration=${duration}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "데이터를 가져올 수 없습니다");
      }

      const data = await response.json();
      setResult(data);
      console.log("✅ 분석 결과:", data);
    } catch (err) {
      console.error("❌ 오류:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            textAlign: "center",
            color: "white",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              🏃‍♂️
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #a78bfa, #f9a8d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              AI 트레이너
            </h1>
          </div>
          <p
            style={{
              fontSize: "18px",
              color: "#9ca3af",
            }}
          >
            스마트폰 앱에서 전송한 건강 데이터를 분석하고 맞춤 운동을 추천합니다
          </p>
        </div>

        {/* 입력 카드 */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "20px",
            padding: "30px",
            border: "1px solid #374151",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              marginBottom: "24px",
              color: "white",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            📱 데이터 불러오기
          </h2>

          {/* 난이도 & 시간 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {/* 난이도 */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                운동 난이도
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "16px",
                  background: "#0a0a0a",
                  border: "1px solid #4b5563",
                  borderRadius: "10px",
                  outline: "none",
                  cursor: "pointer",
                  color: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#4b5563")}
              >
                <option value="하">하 (초보자)</option>
                <option value="중">중 (일반인)</option>
                <option value="상">상 (숙련자)</option>
              </select>
            </div>

            {/* 운동 시간 */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                운동 시간
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "16px",
                  background: "#0a0a0a",
                  border: "1px solid #4b5563",
                  borderRadius: "10px",
                  outline: "none",
                  cursor: "pointer",
                  color: "white",
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

          {/* 버튼 */}
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "white",
              background: loading
                ? "#4b5563"
                : "linear-gradient(135deg, #7c3aed, #db2777)",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              boxShadow: loading
                ? "none"
                : "0 4px 14px 0 rgba(139, 92, 246, 0.25)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(135deg, #6d28d9, #be185d)";
                e.target.style.boxShadow = "0 6px 20px 0 rgba(139, 92, 246, 0.4)";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(135deg, #7c3aed, #db2777)";
                e.target.style.boxShadow = "0 4px 14px 0 rgba(139, 92, 246, 0.25)";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? "⏳ 분석 중..." : "🚀 데이터 받아오기 & 분석"}
          </button>

          {/* 에러 메시지 */}
          {error && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "12px",
                color: "#f87171",
              }}
            >
              ❌ {error}
            </div>
          )}
        </div>

        {/* 결과 표시 */}
        {result && (
          <div>
            {/* 건강 데이터 요약 */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "20px",
                padding: "30px",
                marginBottom: "24px",
                border: "1px solid #374151",
              }}
            >
              <h2
                style={{
                  marginBottom: "12px",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "600",
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
                    fontSize: "16px",
                  }}
                >
                  📊
                </span>
                건강 데이터 요약
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                날짜: {result.date} | User: {result.user_id}
              </p>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#d1d5db",
                  background: "#0a0a0a",
                  padding: "20px",
                  borderRadius: "12px",
                  borderLeft: "4px solid #8b5cf6",
                }}
              >
                {result.summary.summary_text}
              </div>
            </div>

            {/* AI 분석 */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "20px",
                padding: "30px",
                marginBottom: "24px",
                border: "1px solid #374151",
              }}
            >
              <h2
                style={{
                  marginBottom: "16px",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "600",
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
                    fontSize: "16px",
                  }}
                >
                  🤖
                </span>
                AI 분석
              </h2>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#d1d5db",
                  whiteSpace: "pre-line",
                  background: "#0a0a0a",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #374151",
                }}
              >
                {result.analysis}
              </div>
            </div>

            {/* 상세 건강 리포트 */}
            {result.detailed_health_report && (
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: "20px",
                  padding: "30px",
                  marginBottom: "24px",
                  border: "1px solid #374151",
                }}
              >
                <h2
                  style={{
                    marginBottom: "16px",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "600",
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
                      fontSize: "16px",
                    }}
                  >
                    📋
                  </span>
                  상세 건강 리포트
                </h2>
                <div
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.8",
                    color: "#d1d5db",
                    whiteSpace: "pre-line",
                    background: "#0a0a0a",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #374151",
                  }}
                >
                  {result.detailed_health_report}
                </div>
              </div>
            )}

            {/* 운동 루틴 */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "20px",
                padding: "30px",
                border: "1px solid #374151",
              }}
            >
              <h2
                style={{
                  marginBottom: "24px",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "600",
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
                    fontSize: "16px",
                  }}
                >
                  💪
                </span>
                맞춤 운동 루틴
              </h2>

              {/* 루틴 요약 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(219, 39, 119, 0.2))",
                    color: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "36px", fontWeight: "bold" }}>
                    {result.ai_recommended_routine.total_time_min}
                    <span style={{ fontSize: "20px", color: "#a78bfa" }}>분</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "8px" }}>
                    총 운동 시간
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(219, 39, 119, 0.2), rgba(251, 146, 60, 0.2))",
                    color: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid rgba(236, 72, 153, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "36px", fontWeight: "bold" }}>
                    {result.ai_recommended_routine.total_calories}
                    <span style={{ fontSize: "20px", color: "#f9a8d4" }}>kcal</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "8px" }}>
                    예상 칼로리
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 211, 238, 0.2))",
                    color: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid rgba(74, 222, 128, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "36px", fontWeight: "bold" }}>
                    {result.ai_recommended_routine.items?.length || 0}
                    <span style={{ fontSize: "20px", color: "#6ee7b7" }}>개</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "8px" }}>
                    운동 종목
                  </div>
                </div>
              </div>

              {/* 운동 목록 */}
              <h3
                style={{
                  marginBottom: "16px",
                  color: "#a78bfa",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                운동 상세
              </h3>
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                }}
              >
                {result.ai_recommended_routine.items?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#0a0a0a",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      padding: "20px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor = "#8b5cf6";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "#374151";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "white",
                          margin: 0,
                        }}
                      >
                        {index + 1}. {item.exercise_name}
                      </h4>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                          color: "white",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                      >
                        MET {item.met}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "12px",
                        color: "#9ca3af",
                        fontSize: "15px",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: "600", color: "#d1d5db" }}>세트:</span>{" "}
                        <span style={{ color: "#a78bfa" }}>{item.set_count}세트</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: "600", color: "#d1d5db" }}>운동:</span>{" "}
                        <span style={{ color: "#a78bfa" }}>{item.duration_sec}초</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: "600", color: "#d1d5db" }}>휴식:</span>{" "}
                        <span style={{ color: "#a78bfa" }}>{item.rest_sec}초</span>
                      </div>
                      {item.reps && (
                        <div>
                          <span style={{ fontWeight: "600", color: "#d1d5db" }}>반복:</span>{" "}
                          <span style={{ color: "#a78bfa" }}>{item.reps}회</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}