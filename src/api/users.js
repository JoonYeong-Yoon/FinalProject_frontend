import api from "./api";

// 현재 로그인한 유저 정보 가져오기
export const getMyInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/web/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("유저 정보 가져오기 실패", err);
    throw err;
  }
};

// 유저 정보 업데이트
export const updateMyInfo = async (data) => {
  console.log("data", data);
  try {
    const token = localStorage.getItem("token");
    const res = await api.put("/web/users/update", data, {
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
// 유저 정보 삭제
export const deleteUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.delete("/web/users/delete", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("유저 정보 가져오기 실패", err);
    throw err;
  }
};

// 현재 로그인한 유저 정보 가져오기
export const LoginAPI = async (email, password) => {
  try {
    const res = await api.post("/web/users/login", {
      email: email,
      password: password,
    });
    return res.data;
  } catch (err) {
    console.error("로그인 실패", err);
    throw err;
  }
};
