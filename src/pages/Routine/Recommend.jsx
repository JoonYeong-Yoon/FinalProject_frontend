import { useState } from "react";
import SelectTime from "./SelectTime";
import { recommendedByTime, selectedRoutine } from "../../api/recommend";
import Card from "./Card";

const Recommend = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]); // ✅ cards를 state로 관리

  const handleTimeSelect = async (time) => {
    try {
      const res = await recommendedByTime(time);
      console.log(res);

      setCards(res); // ✅ 배열 그대로
      setSelectedTime(time);
      setSelectedCard(null);
    } catch (error) {
      console.error(error);
      setSelectedTime(null);
      setSelectedCard(null);
      setCards([]);
    }
  };

  const handleCardSelect = async (card) => {
    setSelectedCard(card);
    try {
      const res = await selectedRoutine(card.ai_routine_id);
      console.log("res", res);
      console.log("선택된 카드:", card.ai_routine_id);
    } catch (error) {}
  };
  const handleResetCard = () => {
    setSelectedCard(null);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "24px",
        minHeight: "500px",
        color: "black",
      }}
    >
      {/* ⏱ 시간 선택 */}
      {selectedTime === null && <SelectTime handleOnClick={handleTimeSelect} />}

      {/* 📦 카드 / 시각화 영역 */}
      {selectedTime !== null && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {!selectedCard &&
            cards.map((card) => (
              <Card
                key={card.id} // 🔥 API에서 오는 고유값 사용
                card={card}
                selectedTime={selectedTime}
                onSelect={handleCardSelect}
              />
            ))}

          {selectedCard && (
            <>
              <div style={{ gridColumn: "1 / 2" }}>
                <Card
                  card={selectedCard}
                  selectedTime={selectedTime}
                  selected
                  onReset={handleResetCard}
                />
              </div>

              <div
                style={{
                  gridColumn: "2 / span 2",
                  border: "1px dashed #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                시각화 영역
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Recommend;
