import axios from "axios";

// 현재 로그인한 유저 정보 가져오기
export const UploadExerciseVideo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("video", file);
    const res = await axios.post(
      "http://localhost:8000/ai/analyze-video",
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
