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
      "videos/ten_second_video1.mp4",
      "videos/ten_second_video2.mp4",
      "videos/ten_second_video3.mp4",
      "videos/ten_second_video4.mp4",
      "videos/ten_second_video5.mp4",
      "videos/ten_second_video6.mp4",
    ];

    try {
      // 비디오 파일을 읽고 FFmpeg 파일 시스템에 쓰기
      for (let i = 0; i < videoFiles.length; i++) {
        console.log(`Fetching video ${i + 1}`);
        const response = await fetch(videoFiles[i]);
        if (!response.ok) throw new Error(`Failed to fetch video ${i + 1}`);
        const data = await response.arrayBuffer();
        await ffmpeg.FS("writeFile", `input${i}.mp4`, new Uint8Array(data));
        console.log(`Fetched and wrote video ${i + 1}`);
      }

      // concat.txt 파일 생성
      const concatFileContent = videoFiles
        .map((_, index) => `file 'input${index}.mp4'`)
        .join("\n");
      await ffmpeg.FS(
        "writeFile",
        "concat.txt",
        new TextEncoder().encode(concatFileContent)
      );
      console.log("Concat file written");

      // 비디오 병합 실행
      await ffmpeg.run(
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "concat.txt",
        "-c",
        "copy",
        "output.mp4"
      );
      console.log("Videos merged");

      // 병합된 비디오 읽기
      const data = ffmpeg.FS("readFile", "output.mp4");
      const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);

      setMergedVideo(videoUrl);
      setIsLoading(false);
      console.log("Merged video URL set");
    } catch (error) {
      console.error("Error merging videos:", error);
      setIsLoading(false);
    }
  };

  const downloadMergedVideo = () => {
    if (!mergedVideo) {
      console.error("No merged video available for download");
      return;
    }

    const a = document.createElement("a");
    a.href = mergedVideo;
    a.download = "merged-video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <h1>Video Merger</h1>
      {isLoaded ? (
        <>
          <button onClick={mergeVideos}>Merge Videos</button>
          {isLoading && <p>Loading...</p>}
          {mergedVideo && (
            <div>
              <video src={mergedVideo} controls width="600" />
              <button onClick={downloadMergedVideo}>
                Download Merged Video
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading FFmpeg...</p>
      )}
    </div>
  );
};

export default App;
