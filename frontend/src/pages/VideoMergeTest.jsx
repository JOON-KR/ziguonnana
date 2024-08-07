import React, { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = new FFmpeg({ log: true });

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mergedVideo, setMergedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFFmpeg = async () => {
      console.log("Loading FFmpeg...");
      await ffmpeg.load();
      setIsLoaded(true);
      console.log("FFmpeg loaded");
    };
    loadFFmpeg();
  }, []);

  const mergeVideos = async () => {
    setIsLoading(true);
    const videoFiles = [
      'videos/ten_second_video1.mp4',
      'videos/ten_second_video2.mp4',
      'videos/ten_second_video3.mp4',
      'videos/ten_second_video4.mp4',
      'videos/ten_second_video5.mp4',
      'videos/ten_second_video6.mp4',
    ];

    try {
      // 비디오 파일을 읽고 FFmpeg 파일 시스템에 쓰기
      for (let i = 0; i < videoFiles.length; i++) {
        console.log(`Fetching video ${i + 1}`);
        const response = await fetch(videoFiles[i]);
        if (!response.ok) throw new Error(`Failed to fetch video ${i + 1}`);
        const data = await response.arrayBuffer();
        await ffmpeg.FS('writeFile', `input${i}.mp4`, new Uint8Array(data));
        console.log(`Fetched and wrote video ${i + 1}`);
      }

      // concat.txt 파일 생성
      const concatFileContent = videoFiles.map((_, index) => `file 'input${index}.mp4'`).join('\n');
      await ffmpeg.FS('writeFile', 'concat.txt', new TextEncoder().encode(concatFileContent));
      console.log("Concat file written");

      // 비디오 병합 실행
      await ffmpeg.run('-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', 'output.mp4');
      console.log("Videos merged");

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
    document.body.removeChild(a);
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

export default App;
