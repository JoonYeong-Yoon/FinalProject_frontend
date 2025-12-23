import { useState } from "react";
import SelectTime from "./SelectTime";
import { recommendedByTime, CoachingStart,CoachingNext, CoachingCancel } from "../../api/recommend";
import Card from "./Card";
const options = [
  { value: "TOO_HARD", label: "너무 어려움" },
  { value: "TOO_LONG", label: "너무 김" },
  { value: "INJURY", label: "부상" },
  { value: "INTERRUPTED", label: "외부 방해" },
];
const INJURY_KO_TO_EN = {
  어깨: "SHOULDER",
  팔꿈치: "ELBOW",
  허리: "WAIST",
  무릎: "KNEE",
  발목: "ANKLE",
  기타: "ETC",
};
const Recommend = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]); // ✅ cards를 state로 관리
 const [TtsData, setTtsData] = useState("");
 const [TtsText, setTtsText] = useState("");
 const [coachingId, setCoachingId] = useState("")
 const [open, setOpen] = useState(false)
 const [isFinish, setIsFinish] = useState(false)
 const [finishMessage, setFinishMessage] = useState("")
   const [reason, setReason] = useState("");
  const [injuryPart, setInjuryPart] = useState("");

  const handleTimeSelect = async (time) => {
    try {
      const res = await recommendedByTime(time);

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
    console.log(card)
    try {
      
      const res = await CoachingStart(card.ai_routine_id);
      if (res?.tts_text && res?.tts_audio){
        setCoachingId(res.coaching_session_id)
      setTtsText(res.tts_text)
      let data = res.tts_audio
      setTtsData(`data:audio/mp3;base64,${data}`);
      // const res = await selectedRoutine(card.ai_routine_id);
      // console.log("res", res);
      // console.log("선택된 카드:", card.ai_routine_id);
      }
    } catch (error) {
      console.error("코칭 시작 실패:", error);
    }
  };
  const handleResetCard = () => {
    setSelectedCard(null);
  };

  const handleNext = async () =>{
    try{
      const res = await CoachingNext(coachingId)
      setCoachingId(res.coaching_session_id)
      setTtsText(res.tts_text)
      setTtsData(`data:audio/mp3;base64,${res.tts_audio}`);

      console.log("res", res)
      if (res.coaching_session_id === undefined) {
        setIsFinish(true)
        // 👉 coaching_session_id가 없을 때 처리
      }
    }catch(error){
      console.error("코칭 다음 실패:", error);
    }
  }

  const handleCancel =async()=>{
    try{
      const res = await CoachingCancel(coachingId,reason,injuryPart)
      console.log("res",res)
    }catch(error){
      console.error("운동 중단 실패", error)
    }finally{
      setOpen(false)
    }
  }
  console.log("reason",reason, injuryPart)
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
                      display: "flex",
                      flexDirection:"column",
                      gap:"4px",
    justifyContent: "center",
    alignItems: "center",
                }}
              >
                {TtsText&&(
                  <>
                  <h3>{coachingId ? "코칭 시작!" : "코칭 종료"}</h3>
                  <p>{TtsText}</p>
                </>)}
                {TtsData && (
                  
                  <audio controls autoPlay src={TtsData}   
                  style={{
                    width: "80%",
                    display: "block",
                  }}>
                    Your browser does not support the audio element.
                  </audio>
                )}
                <div style={{display:"flex",gap:"4px"}}>
                  <button onClick={handleNext}>다음</button>
                  <button onClick={()=>setOpen(true)}>운동중단</button>
                </div>
                  {isFinish &&(<p>{selectedCard.total_calories}kcal 소모</p>)}

                {open && (
                  <>
                    {/* 배경 오버레이 */}
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                      }}
                      onClick={() => setOpen(false)}
                    />

                    {/* 모달 본체 */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        backgroundColor: "#fff",
                        padding: "24px",
                        borderRadius: "8px",
                        width: "300px",
                        zIndex: 1001,
                        textAlign: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <div style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "bold" }}>
                        중단 사유를 선택해주세요
                      </div>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      >
                        <option value="" disabled>
                          선택해주세요
                        </option>

                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {reason==="INJURY"&&(
                        <select
                          value={injuryPart}
                          onChange={(e) => setInjuryPart(e.target.value)}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                          }}
                        >
                          <option value="" disabled>
                            부상 부위 선택
                          </option>

                          {Object.entries(INJURY_KO_TO_EN).map(([ko, en]) => (
                            <option key={en} value={en}>
                              {ko}
                            </option>
                          ))}
                        </select>
                      )}
                      <button onClick={handleCancel}>
                        확인
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Recommend;
