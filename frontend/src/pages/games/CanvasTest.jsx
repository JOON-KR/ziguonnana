import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

const CanvasTest = () => {
  const canvas1Ref = useRef(null);
  const canvas2Ref = useRef(null);

  const handleMouseUp = async () => {
    console.log("Mouse Up Detected"); // 마우스를 뗄 때 호출되는지 확인하기 위해 추가

    if (canvas1Ref.current && canvas2Ref.current) {
      // 첫 번째 캔버스에서 좌표 데이터 추출
      const paths = await canvas1Ref.current.exportPaths();
      console.log("Canvas 1 Paths:", paths);

      // 추출된 좌표 데이터를 두 번째 캔버스에 적용
      canvas2Ref.current.loadPaths(paths);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div>
        <h3>Canvas 1</h3>
        <div
          onMouseUp={handleMouseUp} // 마우스를 뗄 때 이벤트 트리거
          style={{ border: "1px solid black", width: "500px", height: "500px" }}
        >
          <ReactSketchCanvas
            ref={canvas1Ref}
            strokeWidth={4}
            strokeColor="black"
            width="500px"
            height="500px"
          />
        </div>
      </div>
      <div>
        <h3>Canvas 2</h3>
        <ReactSketchCanvas
          ref={canvas2Ref}
          strokeWidth={4}
          strokeColor="black"
          width="500px"
          height="500px"
        />
      </div>
    </div>
  );
};

export default CanvasTest;
