const SelectTime = ({ handleOnClick }) => {
  const times = [20, 30, 40, 60];
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {times.map((time) => (
        <button
          key={time}
          type="button"
          onClick={() => handleOnClick(time)}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#fff",
          }}
        >
          {time}분
        </button>
      ))}
    </div>
  );
};

export default SelectTime;
