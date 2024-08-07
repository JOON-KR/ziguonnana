import React, { useRef, useState } from 'react';
import { createWorker } from 'ffmpeg.js';

const worker = createWorker();

const VideoMergeTest = () => {
  const videoRefs = useRef([]);
  const [mergedVideo, setMergedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMergeVideos = async () => {
    setLoading(true);

    await worker.load();

    // 각 비디오 파일을 ffmpeg로 로드
    for (let i = 0; i < 6; i++) {
      const videoFile = videoRefs.current[i].src;
      const response = await fetch(videoFile);
      const data = await response.arrayBuffer();
      await worker.write(`input${i + 1}.mp4`, new Uint8Array(data));
    }

    // concat.txt 파일 작성
    const concatTxt = `
      file 'input1.mp4'
      file 'input2.mp4'
      file 'input3.mp4'
      file 'input4.mp4'
      file 'input5.mp4'
      file 'input6.mp4'
    `;
    await worker.write('concat.txt', new TextEncoder().encode(concatTxt));

    // ffmpeg 명령어를 사용하여 비디오 병합
    await worker.run(
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-c', 'copy',
      'output.mp4'
    );

    // 병합된 비디오 파일 가져오기
    const { data } = await worker.read('output.mp4');

    // Blob URL 생성
    const videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    setMergedVideo(videoURL);
    setLoading(false);
  };

  const handleSaveVideo = () => {
    const a = document.createElement('a');
    a.href = mergedVideo;
    a.download = 'merged_video.mp4';
    a.click();
  };

  return (
    <div>
      <div>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <video
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            src={`../assets/videos/ten_second_video${index + 1}.mp4`} // 각 비디오의 경로를 설정
            controls
            width="200"
          />
        ))}
      </div>
      <button onClick={handleMergeVideos} disabled={loading}>
        {loading ? 'Merging...' : 'Merge Videos'}
      </button>
      {mergedVideo && (
        <div>
          <video src={mergedVideo} controls width="600" />
          <button onClick={handleSaveVideo}>Save Video</button>
        </div>
      )}
    </div>
  );
};

export default VideoMergeTest;
