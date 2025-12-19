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
