import "../styles/Gallery10.css";

export default function Gallery10() {
  // public/p1.png ~ public/p5.png
  const images = [
    "/p1.png",
    "/p2.png",
    "/p3.png",
    "/p4.png",
    "/p5.png",
    "/p1.png",
    "/p2.png",
    "/p3.png",
    "/p4.png",
    "/p5.png",
  ];

  return (
    <div className="preview-wrapper">
      <h1 className="preview-title">AI Trainer 주요 기능 미리보기</h1>
      <p className="preview-sub">
        사이트 전체 페이지 화면을 한 번에 보여드립니다.
      </p>

      <div className="preview-grid">
        {images.map((img, i) => (
          <div key={i} className="slanted-wrapper">
            <img src={img} alt={`preview-${i}`} className="slanted-img" />
          </div>
        ))}
      </div>
    </div>
  );
}
