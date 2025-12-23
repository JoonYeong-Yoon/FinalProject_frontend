import { useState } from "react";
import { Calendar, Clock, Flame, Trophy, Edit, Sparkles, SkipForward, X } from 'lucide-react';

const SelectTime = ({ handleOnClick }) => {
  const timeOptions = [20, 30, 40, 60];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {timeOptions.map((time) => (
          <button
            key={time}
            onClick={() => handleOnClick(time)}
            style={{
              padding: '16px 32px',
              backgroundColor: '#1f2937',
              border: '2px solid #374151',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '18px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#a855f7';
              e.target.style.backgroundColor = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#374151';
              e.target.style.backgroundColor = '#1f2937';
            }}
          >
            {time}분
          </button>
        ))}
      </div>
    </div>
  );
};

const Card = ({ card, selectedTime, selected, onSelect, onReset }) => {
  return (
    <div
      onClick={() => !selected && onSelect && onSelect(card)}
      style={{
        border: selected ? '2px solid #a855f7' : '2px solid #374151',
        borderRadius: '16px',
        padding: '24px',
        backgroundColor: selected ? 'rgba(31, 41, 55, 0.5)' : 'rgba(31, 41, 55, 0.3)',
        cursor: selected ? 'default' : 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#374151';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{card.name}</h3>
        {selected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            style={{
              padding: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>
        <span>점수 {card.total_time}분</span>
        <span>·</span>
        <span>{card.total_sets}세트</span>
        <span>·</span>
        <span>{card.total_calories} kcal</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {card.exercises?.map((exercise, idx) => (
          <div key={idx} style={{ borderLeft: '2px solid #a855f7', paddingLeft: '12px' }}>
            <div style={{ fontWeight: '600', color: 'white', marginBottom: '4px' }}>
              {idx + 1}. {exercise.name}
            </div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              {exercise.type} · {exercise.sets}세트 × {exercise.reps}회 · 운동 {exercise.work}초 · 휴식 {exercise.rest}초
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <button
          onClick={onReset}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#374151',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
        >
          다른 루틴 보기
        </button>
      )}
    </div>
  );
};

const Recommend = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [TtsData, setTtsData] = useState("");
  const [TtsText, setTtsText] = useState("");
  const [coachingId, setCoachingId] = useState("");
  const [open, setOpen] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [reason, setReason] = useState("");
  const [injuryPart, setInjuryPart] = useState("");

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

  const stats = {
    weekWorkouts: 5,
    totalTime: "3:45",
    calories: 1250,
    streak: 12,
  };

  const handleTimeSelect = async (time) => {
    const mockCards = [
      {
        id: 1,
        name: "효율 집중",
        total_time: 59.9,
        total_sets: 13.5,
        total_calories: 28.4,
        ai_routine_id: 1,
        exercises: [
          { name: "플랭크", type: "코어", sets: 3, reps: 10, rest: 90, work: 60 },
          { name: "스팬딩 사이드 크런치", type: "코어", sets: 3, reps: 10, rest: 90, work: 60 },
          { name: "스팬딩 니업", type: "상체", sets: 3, reps: 10, rest: 90, work: 60 },
        ],
      },
      {
        id: 2,
        name: "시간 최적",
        total_time: 49.9,
        total_sets: 13.5,
        total_calories: 32.3,
        ai_routine_id: 2,
        exercises: [
          { name: "플랭크", type: "코어", sets: 3, reps: 10, rest: 90, work: 60 },
          { name: "크런치", type: "코어", sets: 3, reps: 10, rest: 90, work: 60 },
          { name: "와이 엑서사이즈", type: "상체", sets: 3, reps: 10, rest: 90, work: 60 },
        ],
      },
      {
        id: 3,
        name: "밸런스",
        total_time: 49.9,
        total_sets: 13.5,
        total_calories: 30,
        ai_routine_id: 3,
        exercises: [
          { name: "와이 엑서사이즈", type: "상체", sets: 3, reps: 10, rest: 90, work: 60 },
          { name: "킵 쓰리스트", type: "하체", sets: 3, reps: 10, rest: 90, work: 60 },
          { name: "플랭크", type: "코어", sets: 3, reps: 10, rest: 90, work: 60 },
        ],
      },
    ];
    
    setCards(mockCards);
    setSelectedTime(time);
    setSelectedCard(null);
  };

  const handleCardSelect = async (card) => {
    setSelectedCard(card);
    setCoachingId("mock-session-id");
    setTtsText("운동을 시작하겠습니다. 준비되셨나요?");
    setTtsData("data:audio/mp3;base64,mock-data");
  };

  const handleResetCard = () => {
    setSelectedCard(null);
    setTtsData("");
    setTtsText("");
    setCoachingId("");
    setIsFinish(false);
  };

  const handleNext = async () => {
    // 실제로는 CoachingNext API 호출
    // const res = await CoachingNext(coachingId)
    
    // Mock: 다음 운동으로 넘어가기
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    const nextCard = cards[currentIndex + 1];
    
    if (nextCard) {
      // 다음 카드가 있으면
      setTtsText(`다음 운동: ${nextCard.exercises[0].name}`);
      setSelectedCard(nextCard);
    } else {
      // 마지막 운동이면
      setIsFinish(true);
      setCoachingId("");
      setTtsText("모든 운동을 완료했습니다! 수고하셨습니다!");
    }
  };

  const handleCancel = async () => {
    setOpen(false);
    handleResetCard();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      {/* 상단 통계 */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Calendar style={{ width: '20px', height: '20px', color: '#a855f7' }} />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>이번 주 운동</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              {stats.weekWorkouts}
              <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '4px' }}>회</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Clock style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>총 운동 시간</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              {stats.totalTime}
              <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '4px' }}>시간</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Flame style={{ width: '20px', height: '20px', color: '#fb923c' }} />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>소모 칼로리</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              {stats.calories}
              <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '4px' }}>kcal</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Trophy style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>연속 운동</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              {stats.streak}
              <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '4px' }}>일</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <button style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)'}
          onMouseLeave={(e) => e.target.style.borderColor = '#1f2937'}
          >
            <Edit style={{ width: '20px', height: '20px' }} />
            <span style={{ fontWeight: '500' }}>웨어러블 추천</span>
          </button>
          <button style={{
            background: 'linear-gradient(to right, #9333ea, #7c3aed)',
            border: 'none',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(to right, #a855f7, #9333ea)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(to right, #9333ea, #7c3aed)';
          }}
          >
            <Sparkles style={{ width: '20px', height: '20px' }} />
            <span style={{ fontWeight: '500' }}>AI 트레이너 추천</span>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ backgroundColor: '#111827', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', minHeight: 'calc(100vh - 280px)', padding: '24px' }}>
        {selectedTime === null && <SelectTime handleOnClick={handleTimeSelect} />}

        {selectedTime !== null && (
          <div style={{ display: 'grid', gridTemplateColumns: !selectedCard ? 'repeat(3, 1fr)' : '1fr 2fr', gap: '16px' }}>
            {!selectedCard &&
              cards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  selectedTime={selectedTime}
                  onSelect={handleCardSelect}
                />
              ))}

            {selectedCard && (
              <>
                <div>
                  <Card
                    card={selectedCard}
                    selectedTime={selectedTime}
                    selected
                    onReset={handleResetCard}
                  />
                </div>

                <div style={{
                  border: '2px dashed #374151',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(31, 41, 55, 0.3)',
                  position: 'relative'
                }}>
                  <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                    {coachingId ? "코칭 시작!" : "코칭 종료"}
                  </h2>

                  {TtsText && (
                    <p style={{ fontSize: '18px', color: '#d1d5db', marginBottom: '24px', textAlign: 'center', maxWidth: '500px' }}>
                      {TtsText}
                    </p>
                  )}

                  {isFinish && (
                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#a855f7', marginBottom: '8px' }}>
                        {selectedCard.total_calories}
                      </div>
                      <div style={{ fontSize: '20px', color: '#9ca3af' }}>kcal 소모</div>
                    </div>
                  )}

                  {TtsData && (
                    <audio
                      controls
                      autoPlay
                      src={TtsData}
                      style={{ width: '100%', maxWidth: '500px', marginBottom: '24px', borderRadius: '8px' }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={handleNext}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(to right, #9333ea, #7c3aed)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #a855f7, #9333ea)'}
                      onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #9333ea, #7c3aed)'}
                    >
                      <SkipForward style={{ width: '20px', height: '20px' }} />
                      다음
                    </button>
                    <button
                      onClick={() => setOpen(true)}
                      style={{
                        padding: '12px 32px',
                        backgroundColor: '#374151',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                    >
                      운동중단
                    </button>
                  </div>

                  {open && (
                    <>
                      <div
                        style={{
                          position: 'fixed',
                          inset: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 50
                        }}
                        onClick={() => setOpen(false)}
                      />

                      <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '400px',
                        zIndex: 51,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>운동 중단</h3>
                          <button
                            onClick={() => setOpen(false)}
                            style={{
                              padding: '4px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '8px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <X style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                              중단 사유
                            </label>
                            <select
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                backgroundColor: '#374151',
                                border: '1px solid #4b5563',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                              }}
                            >
                              <option value="" disabled>선택해주세요</option>
                              {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {reason === "INJURY" && (
                            <div>
                              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                                부상 부위
                              </label>
                              <select
                                value={injuryPart}
                                onChange={(e) => setInjuryPart(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  backgroundColor: '#374151',
                                  border: '1px solid #4b5563',
                                  borderRadius: '12px',
                                  color: 'white',
                                  outline: 'none'
                                }}
                              >
                                <option value="" disabled>부상 부위 선택</option>
                                {Object.entries(INJURY_KO_TO_EN).map(([ko, en]) => (
                                  <option key={en} value={en}>
                                    {ko}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <button
                            onClick={handleCancel}
                            style={{
                              width: '100%',
                              padding: '12px',
                              background: 'linear-gradient(to right, #9333ea, #7c3aed)',
                              border: 'none',
                              borderRadius: '12px',
                              color: 'white',
                              fontWeight: '600',
                              cursor: 'pointer',
                              boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #a855f7, #9333ea)'}
                            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #9333ea, #7c3aed)'}
                          >
                            확인
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;