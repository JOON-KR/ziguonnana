package com.ziguonnana.ziguserver.domain.video.service;

import com.ziguonnana.ziguserver.util.S3Util;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class VideoService {
    @Value("S3.baseURL")
    private String S3_URL;
    private final S3Util s3Util;
    private final RoomRepository roomRepository;

    public String uploadVideo(MultipartFile file, String roomId, int userNo) throws IOException {
        String path = "shorts/" + roomId + "/";
        List<String> userSplitedVideoUrl = roomRepository.getRoom(roomId).getShorts().getUserSplitedVideoUrl();
        String uploadVideoUrl = s3Util.uploadSplitedVideo(file, path, userNo);
        // shorts에 해당 url추가
        userSplitedVideoUrl.add(S3_URL + uploadVideoUrl);
        log.info("userSplitedVideoUrl: " + userSplitedVideoUrl);
        return uploadVideoUrl;
    }
}
