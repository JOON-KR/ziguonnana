import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

const CanvasTest = () => {
  const canvas1Ref = useRef(null);
  const canvas2Ref = useRef(null);

  const handleCanvasChange = async () => {
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
        <ReactSketchCanvas
          ref={canvas1Ref}
          strokeWidth={4}
          strokeColor="black"
          width="500px"
          height="500px"
          onChange={handleCanvasChange} // 그림이 그려질 때마다 호출
        />
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
