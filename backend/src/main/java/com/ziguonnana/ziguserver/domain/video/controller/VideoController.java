package com.ziguonnana.ziguserver.domain.video.controller;

import com.ziguonnana.ziguserver.domain.video.service.VideoService;
import com.ziguonnana.ziguserver.global.ResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequestMapping("/api/v1/video")
@RestController
@Slf4j
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @PostMapping("/{roomId}/member/{userNum}")
    public ResponseDto<String> uploadFile(@RequestParam("file") MultipartFile file, @PathVariable("roomId") String roomId,
                                             @PathVariable("userNum") int userNum) throws IOException {
        log.info("=========== 분할 영상 업로드, userNum:" + userNum + "=========");
        String key = videoService.uploadVideo(file, roomId, userNum);
        return ResponseDto.success(userNum + "번 영상 업로드 완료 : " + key);
    }


}
