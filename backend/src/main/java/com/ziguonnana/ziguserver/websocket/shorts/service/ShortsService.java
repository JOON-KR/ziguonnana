package com.ziguonnana.ziguserver.websocket.shorts.service;


import com.ziguonnana.ziguserver.util.S3Util;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;
import com.ziguonnana.ziguserver.websocket.shorts.dto.Shorts;
import com.ziguonnana.ziguserver.websocket.shorts.dto.ShortsInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShortsService {

    @Value("${S3.baseURL}")
    private String S3_BASEURL;
    private final RoomRepository roomRepository;
    private final S3Util s3Util;
    private final SimpMessagingTemplate simpMessagingTemplate;


    public synchronized void selectVideo(String roomId, int shortsId) {
        Room room = roomRepository.getRoom(roomId);
        if (room.getShortsRequestCnt() > 0) {
            log.info("========= 예시 영상 선택 요청 여러번 ======");
            return; // 여러번 요청들어오면 한번 외에는 무시
        }
        // 쇼츠 선택 request cnt 증가
        room.countShortsRequestCnt();
        Shorts shorts = room.getShorts();
        if (shortsId > 3 || shortsId <= 0) return;

        // 숏츠 id와 인원수에 따라 분할된 예시 영상 url 세팅
        shorts.setExampleVideoInfo(shortsId, room.getPeople());
        log.info("해당 숏츠 id의 분할된 예시 영상 리스트: " + shorts.getSplitedExampleVideoUrl());
        // 숏츠 선택 request cnt 초기화 필요
    }

    public ShortsInfo sendSplitVideoByUserNum(String roomId, int userNo) {
        Room room = roomRepository.getRoom(roomId);
        Shorts shorts = room.getShorts();
        ShortsInfo splitedVideoInfo = shorts.getSplitedExampleVideoUrl().get(userNo - 1);
        return splitedVideoInfo;
    }


    // 쇼츠 합치기
    public synchronized void mergeVideo(String roomId) throws IOException {
        Room room = roomRepository.getRoom(roomId);
        if (room.getShortsMergeRequestCnt() > 0) {
            log.info("========= 영상 합치기 요청 여러번 ======");
            return; // 여러번 요청들어오면 한번 외에는 무시
        }
        // 쇼츠 합치기 request cnt 증가
        room.countShortsMergeRequestCnt();
        log.info("==== 쇼츠 합치기 진행===");

        Shorts shorts = room.getShorts();
        List<String> userSplitedVideoUrl = shorts.getUserSplitedVideoUrl();

        // 쇼츠 합치기
        mergeStart(roomId, userSplitedVideoUrl);
        log.info("쇼츠 선택 서비스 완료");
    }

    @Async
    public void mergeStart(String roomId, List<String> userSplitedVideoUrl) throws IOException {
        String mergeInputfile = createTxtFile(roomId, userSplitedVideoUrl);
        log.info("mergeInputfile(txt) path: " + mergeInputfile);

        String mergeVideoUrl = videoMerge(roomId, mergeInputfile);
        log.info("쇼츠 합치기 완료 : " + mergeVideoUrl);

        // 합치기 완료된 쇼츠 보내기
        Response<String> response = Response.ok(CommandType.SHORTS_MERGE_COMPLETE, S3_BASEURL + mergeVideoUrl);
        simpMessagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

    private String videoMerge(String roomId, String mergeInputfile) throws IOException {
        FFmpeg ffmpeg = new FFmpeg("/usr/bin/ffmpeg");
        FFprobe ffprobe = new FFprobe("/usr/bin/ffprobe");
        String outputfile = "/app/" + roomId + "-mergeVideo.webm";

        FFmpegBuilder builder = new FFmpegBuilder()
                .overrideOutputFiles(true)
                .addInput(mergeInputfile)
                .addExtraArgs("-protocol_whitelist", "file,http,https,tcp,tls")
                .addExtraArgs("-f", "concat")
                .addExtraArgs("-safe", "0")
                .addOutput(outputfile)
                .done();

        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
        executor.createJob(builder).run();

        log.info("video merge 로컬 완료");


        File videoFile = new File(outputfile);
        // s3 업로드
        String path = "shorts/" + roomId + "/mergeVideo-";
        String key = s3Util.uploadVideo(videoFile, path);
        // 텍스트 파일 & 비디오 파일 삭제
        File txtFile = new File(mergeInputfile);
        deleteFile(txtFile);
        deleteFile(videoFile);
        log.info("텍스트파일 & 비디오 파일 삭제 완료");

        return key;

    }

    private boolean deleteFile(File file) {
        if (file.exists()) {
            if (file.delete()) {
                log.info(file + "삭제 완료");
                return true;
            }
            return false; // 파일 삭제 실패
        }
        log.info("파일이 존재하지 않습니다.");
        return false;
    }

    private String createTxtFile(String roomId, List<String> userSplitedVideoUrl) {
        String fileName = "/app/" + roomId + "-mergeInfo.txt";

        // 파일 객체 생성
        File file = new File(fileName);

        // 파일에 내용 쓰기
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            for (String filePath : userSplitedVideoUrl) {
                String fileContent = "file '" + filePath + "'\n";
                writer.write(fileContent);
            }
        } catch (IOException e) {
            log.info("파일 쓰기 실패 : " + e.getMessage());
            return "";
        }

        return fileName;
    }
}
