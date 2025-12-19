const STRATEGY_LABEL = {
  time_based: "시간 최적",
  efficiency_based: "효율 집중",
  balance_based: "밸런스",
};

const Card = ({ card, onSelect, onReset, selected }) => {
  const { strategy, score, total_time_min, total_calories, exercises } = card;

  return (
    <div
      onClick={() => !selected && onSelect?.(card)}
      style={{
        border: selected ? "2px solid #000" : "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        cursor: selected ? "default" : "pointer",
        backgroundColor: selected ? "#f9fafb" : "#fff",
      }}
    >
      {/* 🔝 헤더 */}
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: 0 }}>{STRATEGY_LABEL[strategy]}</h3>
        <p style={{ fontSize: "14px", color: "#666" }}>
          점수 {score} · {total_time_min}분 · {total_calories} kcal
        </p>
      </div>

      {/* 🏋️ 운동 리스트 */}
      <ul style={{ paddingLeft: "16px", margin: 0 }}>
        {exercises.map((ex, idx) => (
          <li key={ex.exercise_id} style={{ marginBottom: "8px" }}>
            <strong>
              {idx + 1}. {ex.name_ko}
            </strong>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {ex.category_ko} · {ex.sets}세트 × {ex.reps}회
              {ex.duration_sec && ` · ${ex.duration_sec}초`}
              {` · 휴식 ${ex.rest_sec}초`}
            </div>
          </li>
        ))}
      </ul>

      {/* 🔙 선택된 카드일 때 */}
      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            background: "#eee",
            cursor: "pointer",
          }}
        >
          다른 추천 보기
        </button>
      )}
    </div>
  );
};

export default Card;
