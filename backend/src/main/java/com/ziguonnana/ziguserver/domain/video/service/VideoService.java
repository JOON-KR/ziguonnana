package com.ziguonnana.ziguserver.domain.video.service;

import com.ziguonnana.ziguserver.util.S3Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final S3Util s3Util;

    public String uploadVideo(MultipartFile file, String roomId, int userNum) throws IOException {
        String path = "shorts/" + roomId + "/";
        return s3Util.uploadSplitedVideo(file, path, userNum);
    }
}
