import api from "./api";

// 유저 정보 업데이트
export const recommendedByTime = async (times) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post(
      "/api/v1/routines/recommend",
      { total_time_min: Number(times) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("유저 정보 업데이트 실패", err);
    throw err;
  }
};

export const selectedRoutine = async (routine_id) => {
  try {
    const token = localStorage.getItem("token");
    console.log("routine_id",routine_id)
    const res = await api.post(`/api/v1/routines/${routine_id}/select`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("유저 정보 업데이트 실패", err);
    throw err;
  }
};

export const CoachingStart = async (routine_id) => {
  try {
    const token = localStorage.getItem("token");
    console.log("routine_id",routine_id)
    const res = await api.post(`/api/v1/coaching/start`,
       {ai_routine_id:routine_id}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("유저 정보 업데이트 실패", err);
    throw err;
  }
};
export const CoachingNext = async (session_id) => {
  try {
    console.log("routine_id",session_id)
    const res = await api.post(`/api/v1/coaching/next`,
       {coaching_session_id:session_id});
    return res.data;
  } catch (err) {
    console.error("유저 정보 업데이트 실패", err);
    throw err;
  }
};

export const CoachingCancel = async (session_id, reason, injury_area) => {
  try {
    console.log("routine_id",session_id, reason, injury_area)
    const res = await api.post(`/api/v1/coaching/cancel`,
       {
        coaching_session_id:session_id,
        cancellation_reason:reason,
        injury_area
       });
    return res.data;
  } catch (err) {
    console.error("운동 취소 실패", err);
    throw err;
  }
};