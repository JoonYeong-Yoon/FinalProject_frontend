import { useState } from "react";
import SelectTime from "./SelectTime";

const Recommend = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  console.log(selectedTime);
  // ✅ 시간 선택 후 기존 화면
  return (
    <div style={{ backgroundColor: "white" }}>
      <div style={{ height: "500px" }}>
        {selectedTime === null && (
          <SelectTime setSelectedTime={setSelectedTime} />
        )}
        <div className="card">a</div>
        <div className="card">b</div>
        <div className="card">c</div>
      </div>
    </div>
  );
};

export default Recommend;
