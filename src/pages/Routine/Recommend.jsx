import { useState, useEffect } from "react";
import { SkipForward, X, Volume2 } from 'lucide-react';

const SelectTime = ({ handleOnClick }) => {
  const timeOptions = [20, 30, 40, 60];
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh',
      gap: '48px'
    }}>
      {/* 헤더 섹션 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ 
          fontSize: '56px', 
          fontWeight: 'bold', 
          background: 'linear-gradient(to right, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          AI 운동 코칭
        </div>
        <div style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '8px' }}>
          오늘도 건강한 하루를 시작하세요
        </div>
        <div style={{ fontSize: '16px', color: '#64748b' }}>
          원하시는 운동 시간을 선택해주세요
        </div>
      </div>

      {/* 시간 선택 버튼들 */}
      <div>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: 'white', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          운동 시간 선택
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {timeOptions.map((time, index) => (
            <button
              key={time}
              onClick={() => handleOnClick(time)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: '20px 40px',
                backgroundColor: hoveredIndex === index ? '#2d3b4e' : '#1e293b',
                border: `2px solid ${hoveredIndex === index ? '#a855f7' : '#334155'}`,
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '24px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s',
                transform: hoveredIndex === index ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredIndex === index ? '0 10px 30px rgba(168, 85, 247, 0.3)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>{time}분</span>
              {hoveredIndex === index && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                  zIndex: 0
                }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 하단 팁 */}
      <div style={{
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px',
        padding: '16px 24px',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#e0e7ff', lineHeight: '1.6' }}>
          💡 <strong>Tip:</strong> 규칙적인 운동은 건강한 삶의 시작입니다. 
          주 3-4회, 하루 30분씩 운동하는 것을 추천드립니다.
        </div>
      </div>
    </div>
  );
};

const Card = ({ card, selectedTime, selected, onSelect, onReset, currentExerciseIndex }) => {
  return (
    <div
      onClick={() => !selected && onSelect && onSelect(card)}
      style={{
        border: selected ? '2px solid #a855f7' : '2px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        backgroundColor: '#1e293b',
        cursor: selected ? 'default' : 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
          e.currentTarget.style.backgroundColor = '#2d3b4e';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#334155';
          e.currentTarget.style.backgroundColor = '#1e293b';
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
            onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>
        <span>총 {card.total_time}분</span>
        <span>·</span>
        <span>{card.total_sets}세트</span>
        <span>·</span>
        <span>{card.total_calories} kcal</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {card.exercises?.map((exercise, idx) => (
          <div 
            key={idx} 
            style={{ 
              borderLeft: selected && currentExerciseIndex === idx ? '3px solid #a855f7' : '2px solid #475569', 
              paddingLeft: '12px',
              backgroundColor: selected && currentExerciseIndex === idx ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
              paddingTop: selected && currentExerciseIndex === idx ? '8px' : '0',
              paddingBottom: selected && currentExerciseIndex === idx ? '8px' : '0',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontWeight: '600', color: selected && currentExerciseIndex === idx ? '#a855f7' : 'white', marginBottom: '4px' }}>
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
            backgroundColor: '#334155',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#475569'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#334155'}
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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [TtsData, setTtsData] = useState("");
  const [TtsText, setTtsText] = useState("");
  const [coachingId, setCoachingId] = useState("");
  const [open, setOpen] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [reason, setReason] = useState("");
  const [injuryPart, setInjuryPart] = useState("");
  const [timerMode, setTimerMode] = useState("work");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

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
          { 
            name: "플랭크", 
            type: "코어", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "팔꿈치를 어깨 아래에 두고 몸을 일직선으로 유지하세요. 복부에 힘을 주고 엉덩이가 처지지 않도록 주의하세요."
          },
          { 
            name: "스팬딩 사이드 크런치", 
            type: "코어", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "서서 한쪽 팔을 머리 위로 올리고 옆구리를 수축하며 팔꿈치와 무릎을 가까이 가져가세요. 반대편도 동일하게 반복하세요."
          },
          { 
            name: "스팬딩 니업", 
            type: "상체", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "서서 무릎을 가슴 쪽으로 올리는 동작을 반복하세요. 복근에 힘을 주고 균형을 유지하세요."
          },
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
          { 
            name: "플랭크", 
            type: "코어", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "팔꿈치를 어깨 아래에 두고 몸을 일직선으로 유지하세요. 복부에 힘을 주고 엉덩이가 처지지 않도록 주의하세요."
          },
          { 
            name: "크런치", 
            type: "코어", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "등을 대고 누워 무릎을 구부리세요. 복근에 힘을 주며 상체를 들어올리고 천천히 내려오세요."
          },
          { 
            name: "와이 엑서사이즈", 
            type: "상체", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "엎드린 자세에서 팔을 Y자 형태로 들어올리세요. 어깨 뒤쪽과 등 근육을 사용하여 천천히 움직이세요."
          },
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
          { 
            name: "와이 엑서사이즈", 
            type: "상체", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "엎드린 자세에서 팔을 Y자 형태로 들어올리세요. 어깨 뒤쪽과 등 근육을 사용하여 천천히 움직이세요."
          },
          { 
            name: "킵 쓰리스트", 
            type: "하체", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "다리를 뻗고 앉아 손으로 바닥을 짚고 엉덩이를 들어올리세요. 하체와 코어에 힘을 주며 자세를 유지하세요."
          },
          { 
            name: "플랭크", 
            type: "코어", 
            sets: 3, 
            reps: 10, 
            rest: 90, 
            work: 60,
            description: "팔꿈치를 어깨 아래에 두고 몸을 일직선으로 유지하세요. 복부에 힘을 주고 엉덩이가 처지지 않도록 주의하세요."
          },
        ],
      },
    ];
    
    setCards(mockCards);
    setSelectedTime(time);
    setSelectedCard(null);
  };

  const handleCardSelect = async (card) => {
    setSelectedCard(card);
    setCurrentExerciseIndex(0);
    setCoachingId("mock-session-id");
    setTtsText(`운동을 시작하겠습니다. 첫 번째 운동: ${card.exercises[0].name}`);
    setTtsData("data:audio/mp3;base64,mock-data");
    setIsFinish(false);
    setTimerMode("work");
    setTimeRemaining(card.exercises[0].work);
    setCurrentSet(1);
  };

  const handleResetCard = () => {
    setSelectedCard(null);
    setCurrentExerciseIndex(0);
    setTtsData("");
    setTtsText("");
    setCoachingId("");
    setIsFinish(false);
    setTimeRemaining(0);
    setTimerMode("work");
    setCurrentSet(1);
  };

  const handleNext = async () => {
    if (!selectedCard) return;

    const currentExercise = selectedCard.exercises[currentExerciseIndex];
    
    if (timerMode === "work") {
      setTimerMode("rest");
      setTimeRemaining(currentExercise.rest);
      return;
    }
    
    if (timerMode === "rest") {
      if (currentSet < currentExercise.sets) {
        setCurrentSet(currentSet + 1);
        setTimerMode("work");
        setTimeRemaining(currentExercise.work);
        return;
      }

      const nextIndex = currentExerciseIndex + 1;
      
      if (nextIndex < selectedCard.exercises.length) {
        setCurrentExerciseIndex(nextIndex);
        const nextExercise = selectedCard.exercises[nextIndex];
        setTtsText(`다음 운동: ${nextExercise.name}`);
        setTtsData("data:audio/mp3;base64,mock-data");
        setTimerMode("work");
        setTimeRemaining(nextExercise.work);
        setCurrentSet(1);
      } else {
        setIsFinish(true);
        setCoachingId("");
        setTtsText("모든 운동을 완료했습니다! 수고하셨습니다!");
        setTtsData("");
      }
    }
  };

  useEffect(() => {
    if (!selectedCard || isFinish || !coachingId || timeRemaining === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCard, isFinish, coachingId, timeRemaining]);

  useEffect(() => {
    if (!selectedCard || isFinish || !coachingId || timeRemaining !== 0) return;

    const currentExercise = selectedCard.exercises[currentExerciseIndex];
    
    if (timerMode === "work") {
      setTimerMode("rest");
      setTimeRemaining(currentExercise.rest);
    } else if (timerMode === "rest") {
      if (currentSet < currentExercise.sets) {
        setCurrentSet(currentSet + 1);
        setTimerMode("work");
        setTimeRemaining(currentExercise.work);
      } else {
        const nextIndex = currentExerciseIndex + 1;
        
        if (nextIndex < selectedCard.exercises.length) {
          setCurrentExerciseIndex(nextIndex);
          const nextExercise = selectedCard.exercises[nextIndex];
          setTtsText(`다음 운동: ${nextExercise.name}`);
          setTtsData("data:audio/mp3;base64,mock-data");
          setTimerMode("work");
          setTimeRemaining(nextExercise.work);
          setCurrentSet(1);
        } else {
          setIsFinish(true);
          setCoachingId("");
          setTtsText("모든 운동을 완료했습니다! 수고하셨습니다!");
          setTtsData("");
        }
      }
    }
  }, [timeRemaining, selectedCard, currentExerciseIndex, timerMode, currentSet, isFinish, coachingId]);

  const handleCancel = async () => {
    setOpen(false);
    handleResetCard();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '24px' }}>
      {selectedTime === null && <SelectTime handleOnClick={handleTimeSelect} />}

      {selectedTime !== null && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: !selectedCard ? 'repeat(3, 1fr)' : '400px 1fr', 
          gap: '24px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
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
                  currentExerciseIndex={currentExerciseIndex}
                />
              </div>

              <div style={{
                border: '2px dashed #334155',
                borderRadius: '16px',
                padding: '48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1e293b',
                position: 'relative',
                minHeight: '600px'
              }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                  {isFinish ? "운동 완료!" : "코칭 시작!"}
                </h2>

                {!isFinish && selectedCard && (
                  <div style={{ marginBottom: '24px', textAlign: 'center', width: '100%' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#a855f7', marginBottom: '12px' }}>
                      {selectedCard.exercises[currentExerciseIndex].name}
                    </div>
                    <div style={{ fontSize: '20px', color: '#9ca3af', marginBottom: '16px' }}>
                      {currentExerciseIndex + 1} / {selectedCard.exercises.length}
                    </div>

                    <div style={{ 
                      marginBottom: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{ 
                        fontSize: '72px', 
                        fontWeight: 'bold', 
                        color: timerMode === "work" ? '#a855f7' : '#60a5fa',
                        textShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
                      }}>
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '600',
                        color: timerMode === "work" ? '#a855f7' : '#60a5fa',
                        backgroundColor: timerMode === "work" ? 'rgba(168, 85, 247, 0.2)' : 'rgba(96, 165, 250, 0.2)',
                        padding: '8px 24px',
                        borderRadius: '20px',
                        border: `2px solid ${timerMode === "work" ? '#a855f7' : '#60a5fa'}`
                      }}>
                        {timerMode === "work" ? `운동 중 (${currentSet}/${selectedCard.exercises[currentExerciseIndex].sets}세트)` : '휴식 중'}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      justifyContent: 'center', 
                      flexWrap: 'wrap',
                      marginBottom: '16px'
                    }}>
                      <div style={{ 
                        backgroundColor: 'rgba(168, 85, 247, 0.15)', 
                        padding: '8px 16px', 
                        borderRadius: '8px',
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                      }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>세트: </span>
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                          {currentSet}/{selectedCard.exercises[currentExerciseIndex].sets}
                        </span>
                      </div>
                      <div style={{ 
                        backgroundColor: 'rgba(168, 85, 247, 0.15)', 
                        padding: '8px 16px', 
                        borderRadius: '8px',
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                      }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>횟수: </span>
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                          {selectedCard.exercises[currentExerciseIndex].reps}회
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '16px', color: '#d1d5db', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
                      다음 운동: {currentExerciseIndex < selectedCard.exercises.length - 1 
                        ? selectedCard.exercises[currentExerciseIndex + 1].name 
                        : '마지막 운동입니다'}
                    </div>

                    <div style={{ 
                      marginTop: '24px',
                      padding: '16px 24px',
                      backgroundColor: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      borderRadius: '12px',
                      maxWidth: '500px',
                      margin: '24px auto 0'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          color: '#a855f7',
                          fontWeight: '600'
                        }}>
                          <Volume2 style={{ width: '20px', height: '20px' }} />
                          운동 설명
                        </div>
                        <button
                          onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(selectedCard.exercises[currentExerciseIndex].description);
                            utterance.lang = 'ko-KR';
                            utterance.rate = 0.9;
                            window.speechSynthesis.speak(utterance);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'rgba(168, 85, 247, 0.3)',
                            border: '1px solid #a855f7',
                            borderRadius: '8px',
                            color: '#a855f7',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
                          }}
                        >
                          <Volume2 style={{ width: '14px', height: '14px' }} />
                          듣기
                        </button>
                      </div>
                      <div style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6' }}>
                        {selectedCard.exercises[currentExerciseIndex].description}
                      </div>
                    </div>
                  </div>
                )}

                {isFinish && (
                  <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#a855f7', marginBottom: '8px' }}>
                      {selectedCard.total_calories}
                    </div>
                    <div style={{ fontSize: '20px', color: '#9ca3af' }}>kcal 소모</div>
                  </div>
                )}

                {!isFinish && (
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
                        backgroundColor: '#334155',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#475569'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#334155'}
                    >
                      운동중단
                    </button>
                  </div>
                )}

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
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
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
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
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
                              backgroundColor: '#334155',
                              border: '1px solid #475569',
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
                                backgroundColor: '#334155',
                                border: '1px solid #475569',
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
  );
};

export default Recommend;