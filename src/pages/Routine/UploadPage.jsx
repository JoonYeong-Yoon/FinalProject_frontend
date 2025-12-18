import React, { useState } from "react";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 사용자 ID
  const [userId, setUserId] = useState("test123");

  const [difficulty, setDifficulty] = useState("중");
  const [duration, setDuration] = useState(30);
  const [uploadMode, setUploadMode] = useState("manual_file");

  // 실제 raw_json 입력
  const [rawJsonInput, setRawJsonInput] = useState("");

  // ✅ 백엔드 서버 주소 (환경에 맞게 수정)
  const BACKEND_URL = "http://localhost:8001"; // 또는 'http://localhost:8000'

  // 운동명 매핑
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

  // ----------------------------------------------------
  // 공통 API 호출 (개선 버전)
  // ----------------------------------------------------
  const callApi = async (url, options) => {
    setResult(null);
    setError(null);
    setLoading(true);

    console.log("[DEBUG] API 호출:", url);
    console.log("[DEBUG] Options:", options);

    try {
      const response = await fetch(url, options);
      const responseBody = await response.text();

      console.log("[DEBUG] 응답 상태:", response.status);
      console.log("[DEBUG] 응답 본문:", responseBody);

      if (!response.ok) {
        throw new Error(`서버 응답 오류 (${response.status}): ${responseBody}`);
      }

      let data;
      try {
        data = JSON.parse(responseBody);
      } catch (e) {
        throw new Error(`JSON 파싱 실패: ${responseBody}`);
      }

      console.log("[SUCCESS] 파싱 완료:", data);
      setResult(data);

      // 디버그 정보 출력
      if (data.debug_info) {
        console.log("[DEBUG] 서버 디버그 정보:", data.debug_info);
      }
    } catch (err) {
      console.error("[ERROR] API 호출 실패:", err);
      setError(err.message);
      alert("API 호출 오류: " + err.message);
    }

    setLoading(false);
  };

  // ----------------------------------------------------
  // ZIP/DB 파일 업로드
  // ----------------------------------------------------
  const handleFileSubmit = async () => {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    // ✅ user_id 검증
    const validUserId = userId && userId.trim() ? userId : "test123";

    const formData = new FormData();
    formData.append("file", file);

    const url = `${BACKEND_URL}/api/file/upload?user_id=${validUserId}&difficulty=${difficulty}&duration=${duration}`;

    await callApi(url, {
      method: "POST",
      body: formData,
    });
  };

  // ----------------------------------------------------
  // Health Connect / HealthKit JSON 입력 (개선!)
  // ----------------------------------------------------
  const handleAutoSubmit = async () => {
    let parsedJson;

    try {
      parsedJson = JSON.parse(rawJsonInput);
    } catch (e) {
      alert("❌ JSON 파싱 오류: 올바른 JSON 형식인지 확인하세요.");
      return;
    }

    console.log("[DEBUG] 전송할 JSON:", parsedJson);

    // ✅ user_id 검증
    const validUserId = userId && userId.trim() ? userId : "test123";

    const body = {
      user_id: validUserId,
      raw_json: parsedJson,
      summary: null,
      difficulty,
      duration,
    };

    // ✅ 절대 경로 사용!
    const url = `${BACKEND_URL}/api/auto/upload`;

    await callApi(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  // ----------------------------------------------------
  // 서버에서 최신 데이터 가져오기
  // ----------------------------------------------------
  const fetchLatestData = async () => {
    // ✅ user_id 검증
    const validUserId = userId && userId.trim() ? userId : "test123";
    const url = `${BACKEND_URL}/api/user/latest-summary?user_id=${validUserId}`;

    await callApi(url, { method: "GET" });
  };

  const secToMinSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
  };

  // ----------------------------------------------------
  // 데이터 형식 가이드
  // ----------------------------------------------------
  const getDataFormatGuide = () => {
    if (uploadMode === "health_connect") {
      return `삼성 Health Connect 데이터 형식:
{
  "sleep": 420,          // 수면 (분)
  "steps": 8500,         // 걸음수
  "weight": 70500,       // 체중 (그램)
  "height": 175,         // 키 (cm)
  "distance": 5400,      // 이동거리 (미터)
  "heartRate": 75,       // 심박수
  "restingHeartRate": 60,// 휴식기 심박수
  "calories": 300,       // 활동 칼로리
  "totalCaloriesBurned": 2100  // 총 소모 칼로리
}`;
    } else {
      return `Apple HealthKit 데이터 형식:
{
  "sleepHours": 7.0,     // 수면 (시간)
  "steps": 8500,         // 걸음수
  "weight": 70.5,        // 체중 (kg)
  "height": 175,         // 키 (cm)
  "distance": 5.4,       // 이동거리 (km)
  "heartRate": 75,       // 심박수
  "restingHeartRate": 60,// 휴식기 심박수
  "activeEnergy": 300,   // 활동 칼로리
  "bmi": 23.0            // BMI (선택)
}`;
    }
  };

  // ----------------------------------------------------
  // 렌더링
  // ----------------------------------------------------
  return (
    <div
      style={{
        padding: "40px",
        color: "white",
      }}
    >
      <h2>🏋️ AI 맞춤 운동 추천 서비스</h2>
      <p style={{ color: "#888", fontSize: "14px" }}>
        백엔드 서버: {BACKEND_URL}
      </p>

      {/* 에러 메시지 */}
      {error && (
        <div
          style={{
            background: "#c0392b",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          ⚠️ 오류: {error}
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={fetchLatestData}
          style={{
            padding: "10px 20px",
            background: "#9b59b6",
            borderRadius: "6px",
            marginBottom: "10px",
            cursor: "pointer",
            border: "1px solid #555",
            color: "white",
          }}
        >
          🔄 서버에서 최신 분석 결과 불러오기
        </button>
      </div>

      {/* 데이터 소스 선택 */}
      <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setUploadMode("manual_file")}
          style={{
            padding: "10px 15px",
            background: uploadMode === "manual_file" ? "#3498db" : "#333",
            border: "1px solid #555",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          📁 수동 파일 업로드 (ZIP/DB)
        </button>

        <button
          onClick={() => setUploadMode("health_connect")}
          style={{
            padding: "10px 15px",
            background: uploadMode === "health_connect" ? "#3498db" : "#333",
            border: "1px solid #555",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          🤖 Health Connect 데이터 입력
        </button>

        <button
          onClick={() => setUploadMode("health_kit")}
          style={{
            padding: "10px 15px",
            background: uploadMode === "health_kit" ? "#3498db" : "#333",
            border: "1px solid #555",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          🍎 Apple HealthKit 데이터 입력
        </button>
      </div>

      <hr style={{ borderColor: "#333" }} />

      {/* 공통 설정 */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          margin: "20px 0",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <label>사용자 ID: </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{
              padding: "8px",
              marginLeft: "10px",
              color: "black",
              width: "150px",
              borderRadius: "4px",
            }}
            placeholder="user123"
          />
        </div>

        <div>
          <label>운동 난이도: </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ padding: "8px", marginLeft: "10px", borderRadius: "4px" }}
          >
            <option value="하">하 (초보)</option>
            <option value="중">중 (보통)</option>
            <option value="상">상 (고급)</option>
          </select>
        </div>

        <div>
          <label>운동 시간: </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ padding: "8px", marginLeft: "10px", borderRadius: "4px" }}
          >
            <option value={10}>10분</option>
            <option value={30}>30분</option>
            <option value={60}>60분</option>
          </select>
        </div>
      </div>

      {/* ZIP/DB 업로드 */}
      {uploadMode === "manual_file" && (
        <div
          style={{
            padding: "20px",
            border: "1px dashed #555",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h3>① ZIP/DB 파일 업로드</h3>
          <p style={{ color: "#888", fontSize: "14px" }}>
            삼성 Health Connect에서 내보낸 ZIP 파일을 업로드하세요
          </p>
          <input
            type="file"
            accept=".db,.zip"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ margin: "20px 0", color: "white" }}
          />
          <br />
          <button
            onClick={handleFileSubmit}
            disabled={!file || loading}
            style={{
              padding: "10px 20px",
              background: file && !loading ? "#e74c3c" : "#555",
              cursor: file && !loading ? "pointer" : "not-allowed",
              border: "none",
              borderRadius: "6px",
              color: "white",
            }}
          >
            {loading ? "⏳ 분석 중..." : "🚀 업로드 & 분석"}
          </button>
        </div>
      )}

      {/* 실제 Raw JSON 입력 */}
      {(uploadMode === "health_connect" || uploadMode === "health_kit") && (
        <div
          style={{
            padding: "20px",
            border: "1px dashed #555",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h3>② Health Data JSON 입력</h3>
          <p style={{ color: "#888", fontSize: "14px" }}>
            {uploadMode === "health_connect"
              ? "삼성 Health Connect에서 추출한 JSON 데이터를 입력하세요"
              : "Apple HealthKit에서 추출한 JSON 데이터를 입력하세요"}
          </p>

          {/* 데이터 형식 가이드 */}
          <details
            style={{
              background: "#2c3e50",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            <summary style={{ fontWeight: "bold", color: "#3498db" }}>
              📖 데이터 형식 가이드 (클릭하여 펼치기)
            </summary>
            <pre
              style={{
                marginTop: "10px",
                padding: "10px",
                background: "#1e272e",
                borderRadius: "4px",
                fontSize: "13px",
                lineHeight: "1.5",
                overflow: "auto",
                color: "#ecf0f1",
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
              height: "350px", // 250px → 350px
              padding: "15px",
              borderRadius: "8px",
              marginTop: "10px",
              background: "#1a1a1a", // 더 어두운 배경
              color: "#00ff00", // 밝은 초록색
              border: "2px solid #444", // 더 두꺼운 테두리
              fontFamily: "Consolas, Monaco, monospace",
              fontSize: "14px",
              lineHeight: "1.6",
              resize: "vertical", // 세로 크기 조절 가능
            }}
          />

          <button
            onClick={handleAutoSubmit}
            disabled={!rawJsonInput || loading}
            style={{
              padding: "10px 20px",
              background: rawJsonInput && !loading ? "#2ecc71" : "#555",
              marginTop: "10px",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: rawJsonInput && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "⏳ 분석 중..." : "🚀 데이터 전송 & 분석"}
          </button>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "20px",
              background: "#2c3e50",
              borderRadius: "10px",
            }}
          >
            <p style={{ fontSize: "18px", margin: 0 }}>
              🤖 AI가 건강 데이터를 분석 중입니다...
            </p>
            <p style={{ color: "#888", fontSize: "14px", marginTop: "10px" }}>
              잠시만 기다려 주세요!
            </p>
          </div>
        </div>
      )}

      {/* 결과 출력 */}
      {result && !loading && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ color: "#3498db" }}>📊 분석 결과</h2>

          {/* 디버그 정보 */}
          {result.debug_info && (
            <div
              style={{
                background: "#34495e",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "12px",
              }}
            >
              <strong>🔍 디버그 정보:</strong>
              <pre style={{ margin: "5px 0" }}>
                {JSON.stringify(result.debug_info, null, 2)}
              </pre>
            </div>
          )}

          {/* 분석 텍스트 */}
          <h3 style={{ marginTop: "30px" }}>💬 AI 분석</h3>
          <div
            style={{
              background: "#1e272e",
              padding: "20px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              border: "1px solid #333",
            }}
          >
            {result.llm_result?.analysis ?? "❌ 분석 결과 없음"}
          </div>

          {/* 운동 루틴 */}
          <h3 style={{ marginTop: "30px" }}>💪 AI 추천 운동 루틴</h3>
          {result.llm_result?.ai_recommended_routine ? (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "30px",
                  marginBottom: "20px",
                  padding: "15px",
                  background: "#2c3e50",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <strong>⏱️ 총 운동 시간:</strong>{" "}
                  {result.llm_result.ai_recommended_routine.total_time_min}분
                </div>
                <div>
                  <strong>🔥 예상 소모 칼로리:</strong>{" "}
                  {result.llm_result.ai_recommended_routine.total_calories} kcal
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#1e272e",
                }}
              >
                <thead>
                  <tr style={{ background: "#34495e" }}>
                    <th style={{ padding: "12px", border: "1px solid #444" }}>
                      운동명
                    </th>
                    <th style={{ padding: "12px", border: "1px solid #444" }}>
                      난이도
                    </th>
                    <th style={{ padding: "12px", border: "1px solid #444" }}>
                      MET
                    </th>
                    <th style={{ padding: "12px", border: "1px solid #444" }}>
                      운동시간
                    </th>
                    <th style={{ padding: "12px", border: "1px solid #444" }}>
                      휴식시간
                    </th>
                    <th style={{ padding: "12px", border: "1px solid #444" }}>
                      세트수
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {result.llm_result.ai_recommended_routine.items?.map(
                    (item, idx) => {
                      const getDifficultyLabel = (diff) => {
                        if (diff <= 2) return "하";
                        if (diff === 3) return "중";
                        return "상";
                      };

                      return (
                        <tr
                          key={idx}
                          style={{
                            background: idx % 2 ? "#1e272e" : "#2c3e50",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px",
                              border: "1px solid #444",
                              fontWeight: "bold",
                            }}
                          >
                            {exerciseNameKo[item.exercise_name] ??
                              item.exercise_name}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              border: "1px solid #444",
                              textAlign: "center",
                            }}
                          >
                            {getDifficultyLabel(item.difficulty)}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              border: "1px solid #444",
                              textAlign: "center",
                            }}
                          >
                            {item.met}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              border: "1px solid #444",
                              textAlign: "center",
                            }}
                          >
                            {secToMinSec(item.duration_sec)}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              border: "1px solid #444",
                              textAlign: "center",
                            }}
                          >
                            {secToMinSec(item.rest_sec)}
                          </td>

                          <td
                            style={{
                              padding: "12px",
                              border: "1px solid #444",
                              textAlign: "center",
                            }}
                          >
                            {item.set_count}회
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                padding: "20px",
                background: "#c0392b",
                borderRadius: "8px",
              }}
            >
              ❌ 운동 루틴을 생성하지 못했습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadPage;
