// src/pages/Dashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

import ParticleHuman from "../components/ParticleHuman";
import { EXERCISE_DB } from "../data/EXERCISE_DB";
import { MUSCLE_INDEXES } from "../data/MUSCLE_INDEXES";
import ChatBot from "../components/ChatBot";

// ============================
// ⭐ 복근 KEY 정의
// ============================
const ABS_KEYS = [
  "abs_upper_1",
  "abs_upper_2",
  "abs_mid_1",
  "abs_mid_2",
  "abs_lower",
];

// ============================
// 근육 그룹 정의
// ============================
const MAIN_GROUPS = {
  chest: ["upper_chest", "middle_chest", "lower_chest"],
  shoulders: ["front_delts", "side_delts", "rear_delts"],
  back: [
    "traps_upper",
    "traps_middle",
    "traps_lower",
    "lat_upper_1",
    "lat_upper_2",
    "lat_middle",
    "lat_lower",
    "mid_back",
    "erector_spinae",
  ],
  arms: [
    "bicep_brachialis",
    "brachialis",
    "forearm_brachioradialis",
    "forearm_flexor",
    "triceps_long",
    "triceps_lateral",
    "triceps_medial",
  ],
  core: ["abs_upper_1", "abs_upper_2", "abs_mid_1", "abs_mid_2", "abs_lower"],
  glutes: ["glute_outer", "glute_middle", "glute_center"],
  thighs: [
    "thigh_upper",
    "thigh_outer",
    "thigh_middle",
    "thigh_lower",
    "thigh_inner",
  ],
  hamstrings: ["hamstring_outer", "hamstring_inner"],
  calves: ["calf_outer", "calf_inner", "soleus"],
};

const LABELS = {
  upper_chest: "상부 가슴",
  middle_chest: "중부 가슴",
  lower_chest: "하부 가슴",

  front_delts: "전면 삼각근",
  side_delts: "측면 삼각근",
  rear_delts: "후면 삼각근",

  traps_upper: "승모근 상부",
  traps_middle: "승모근 중부",
  traps_lower: "승모근 하부",

  lat_upper_1: "광배 상부 1",
  lat_upper_2: "광배 상부 2",
  lat_middle: "광배 중부",
  lat_lower: "광배 하부",

  mid_back: "능형근",
  erector_spinae: "척추기립근",

  bicep_brachialis: "상완요골근",
  brachialis: "상완근",
  forearm_brachioradialis: "전완요골근",
  forearm_flexor: "전완 굴곡근",

  triceps_long: "삼두 장두",
  triceps_lateral: "삼두 외측두",
  triceps_medial: "삼두 내측두",

  abs_upper_1: "상복근 1",
  abs_upper_2: "상복근 2",
  abs_mid_1: "중복근 1",
  abs_mid_2: "중복근 2",
  abs_lower: "하복근",

  glute_outer: "엉덩이 바깥",
  glute_middle: "엉덩이 중앙",
  glute_center: "엉덩이 안쪽",

  thigh_upper: "앞벅지 상부",
  thigh_outer: "외측광근",
  thigh_middle: "대퇴직근",
  thigh_lower: "앞벅지 하부",
  thigh_inner: "내측광근",

  hamstring_outer: "햄스트링 외측",
  hamstring_inner: "햄스트링 내측",

  calf_outer: "종아리 외측",
  calf_inner: "종아리 내측",
  soleus: "가자미근",
};

const MAIN_LIST = [
  { key: "chest", title: "🦾 가슴" },
  { key: "shoulders", title: "💪 어깨" },
  { key: "back", title: "🏋️ 등" },
  { key: "arms", title: "🫱 팔" },
  { key: "core", title: "🧩 복근" },
  { key: "glutes", title: "🍑 엉덩이" },
  { key: "thighs", title: "🦵 허벅지" },
  { key: "hamstrings", title: "🦿 뒷벅지" },
  { key: "calves", title: "🦶 종아리" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [highlightMuscles, setHighlightMuscles] = useState([]);

  const [hoverMain, setHoverMain] = useState(null);
  const [messages, setMessages] = useState([]);
  const [character, setCharacter] = useState("booster_coach"); // 기본 캐릭터

  // ============================
  // 챗봇 상태
  // ============================
  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      text: "안녕하세요! AI 트레이너입니다. 무엇을 도와드릴까요?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatMessagesRef = useRef(null);

  const SECTION_REFS = useRef({});

  // ============================
  // 스크롤 감지
  // ============================
  const handleScroll = () => {
    const container = document.getElementById("scroll-panel");
    if (!container) return;

    const center = container.scrollTop + container.clientHeight / 2;

    Object.keys(SECTION_REFS.current).forEach((key) => {
      const sec = SECTION_REFS.current[key];
      if (!sec) return;

      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;

      if (center >= top && center <= bottom) {
        setSelectedMain(key);
      }
    });
  };

  // ============================
  // 챗봇 전송
  // ============================
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", text: inputMessage }]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "메시지를 받았습니다! 어떤 운동에 대해 궁금하신가요?",
        },
      ]);
    }, 600);

    setInputMessage("");
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ==========================================================
  // ⭐ 운동 클릭 시 highlightMuscles 처리 — 복근 제외 기능 최종 적용
  // ==========================================================
  const handleExerciseClick = (ex) => {
    const muscles = [...ex.primary, ...ex.secondary, ...(ex.tertiary || [])];

    const isAbsExercise = muscles.some((m) => ABS_KEYS.includes(m));

    if (isAbsExercise) {
      // 복근 운동 → 복근 포함 전체 표시
      setHighlightMuscles(muscles);
      return;
    }

    // 복근이 섞여 있더라도 무조건 제거 (외복사근 제외)
    const filtered = muscles.filter((m) => !ABS_KEYS.includes(m));

    setHighlightMuscles(filtered);
  };

  // ================================
  // 1) 일반 자유형 챗 메시지
  // ================================
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // 메시지 추가 함수
    const addMessage = (sender, text) => {
      setMessages((prev) => [...prev, { sender, text }]);
    };

    addMessage("user", inputMessage);

    const body = {
      user_id: "test123",
      message: inputMessage,
      character: character,
    };

    setInputMessage("");

    try {
      const res = await fetch("http://localhost:8001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      addMessage("bot", data.response);
    } catch (error) {
      addMessage("bot", "⚠️ 서버 연결 오류 발생");
    }
  };
  // ============================
  // RENDER
  // ============================
  return (
    <div className="dashboard-wrapper">
      <div className="title-area">
        <h1>Welcome, Trainer!</h1>
        <p>운동 부위를 선택해보세요</p>
      </div>

      <div className="dashboard-container">
        {/* LEFT 상단 패널 */}
        <div className="left-top-panel">
          <div
            id="scroll-panel"
            className="left-glass-panel"
            onScroll={handleScroll}
          >
            {MAIN_LIST.map((m) => (
              <div
                key={m.key}
                ref={(el) => (SECTION_REFS.current[m.key] = el)}
                className={`muscle-section ${
                  selectedMain === m.key ? "active-section" : ""
                }`}
                onMouseEnter={() => setHoverMain(m.key)}
                onMouseLeave={() => setHoverMain(null)}
              >
                <h2>{m.title}</h2>

                <div className="sub-chest-box">
                  {MAIN_GROUPS[m.key].map((sub) => (
                    <div
                      key={sub}
                      className={`sub-item ${
                        selectedSub === sub ? "sub-selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedMain(m.key);
                        setSelectedSub(sub);
                        setHighlightMuscles([]);
                      }}
                    >
                      {LABELS[sub]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEFT 하단 패널 */}
        <div className="left-bottom-panel">
          <div className="exercise-list-box-fixed">
            <div className="exercise-header-fixed">
              <h2 className="exercise-title">
                {selectedSub ? `📌 ${LABELS[selectedSub]}` : "🚀 운동 선택"}
              </h2>
            </div>

            {selectedSub && EXERCISE_DB[selectedSub] ? (
              <ul className="exercise-list">
                {EXERCISE_DB[selectedSub].map((ex, i) => (
                  <li
                    key={i}
                    className="exercise-item"
                    onClick={() => handleExerciseClick(ex)}
                  >
                    <strong className="ex-name">{ex.name}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="exercise-empty">
                <p>왼쪽에서 부위를 선택하세요</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 3D 모델 */}
        <div className="dashboard-right">
          <div className="human-wrapper">
            <ParticleHuman
              width={700}
              height={950}
              selectedMuscle={selectedMain}
              hoverMuscle={hoverMain}
              highlightMuscles={highlightMuscles}
            />
          </div>
        </div>
      </div>

      {/* CHATBOT */}
      <div className="chatbot-container">
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chatbot-icon-small">🤖</div>
              <span className="chat-header-title">AI Trainer</span>
            </div>
          </div>

          <div className="chat-messages" ref={chatMessagesRef}>
            <ChatBot
              input={inputMessage}
              setInput={setInputMessage}
              messages={messages}
              setMessages={setMessages}
              character={character}
              setCharacter={setCharacter}
              handleSend={handleSendMessage}
            />
            {/* 
            {chatMessages.map((msg, idx) => (
              <>
                <div
                  key={idx}
                  className={`chat-message ${
                    msg.role === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  {msg.text}
                </div>
              </>
            ))} */}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="메시지를 입력하세요..."
              className="chat-input-field"
            />
            <button onClick={sendMessage} className="chat-send-btn">
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
