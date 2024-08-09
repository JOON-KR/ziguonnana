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

    @PostMapping("/{roomId}/member/{userNo}")
    public ResponseDto<String> uploadFile(@RequestParam("file") MultipartFile file, @PathVariable("roomId") String roomId,
                                             @PathVariable("userNo") int userNo) throws IOException {
        log.info("=========== 분할 영상 업로드, userNo:" + userNo + "=========");
        String key = videoService.uploadVideo(file, roomId, userNo);
        return ResponseDto.success(userNo + "번 영상 업로드 완료 : " + key);
    }
}
