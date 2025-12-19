import axios from "axios";
import { wearable_api } from "./api";

// 현재 로그인한 유저 정보 가져오기
export const UploadExerciseVideo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("video", file);
    const res = await axios.post(
      "http://192.168.0.32:8000/ai/analyze-video",
      formData,
      {
        responseType: "blob",
      }
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("유저 정보 가져오기 실패", err);
    throw err;
  }
};

export const ChatFix = async (body) => {
  try {
    const res = await wearable_api.post("/api/chat/fixed", body);
    return res.data;
  } catch (err) {
    console.error("유저 정보 가져오기 실패", err);
    throw err;
  }
};

export const ChatMain = async (body) => {
  console.log("body", body);
  try {
    const res = await wearable_api.post("/api/chat", body);
    return res.data;
  } catch (err) {
    console.error("유저 정보 가져오기 실패", err);
    throw err;
  }
};
