import api from "./api";

// 현재 로그인한 유저 정보 가져오기
export const getMyInfo = async () => {
  return await api.get("/users/me");
};

// 유저 정보 업데이트
export const updateMyInfo = async (data) => {
  return await api.put("/users/update", data);
};
