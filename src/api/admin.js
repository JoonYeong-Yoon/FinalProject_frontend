import api from "./api";

export const getUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (err) {
    console.error("유저 목록 가져오기 실패", err);
    throw err;
  }
};

export const updateRole = async (id, role) => {
  try {
    const res = await api.patch(`/admin/users/${id}/role`, { role: role });
    console.log(res);
    return res.data;
  } catch (err) {
    console.error("권한 수정 실패", err);
    throw err;
  }
};

export const updateSubscription = async (id, plan_name, status) => {
  try {
    const res = await api.post(`/admin/users/${id}/subscription`, {
      plan_name,
      status,
    });
    return res.data;
  } catch (err) {
    console.error("구독 정보 수정 실패", err);
    throw err;
  }
};

export const deleteUserById = async (id) => {
  try {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  } catch (err) {
    console.error("유저 정보 가져오기 실패", err);
    throw err;
  }
};
