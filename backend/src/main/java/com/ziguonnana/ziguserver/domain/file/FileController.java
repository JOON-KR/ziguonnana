package com.ziguonnana.ziguserver.domain.file;

import com.ziguonnana.ziguserver.util.S3Util;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final S3Util s3Util;

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        //path는 알아서 설정하기
        String uploadedAddress = s3Util.upload(file, "realyArt/");
        log.info("이미지 경로: {}",uploadedAddress);
        return ResponseEntity.ok().body("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/"+uploadedAddress);
    }

    @DeleteMapping("{imageAddress}")
    public ResponseEntity<String> deleteFile(@PathVariable("imageAddress") String imageAddress) throws IOException {
        s3Util.deleteImageFromS3(imageAddress);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/pose/{fileName}")
    public ResponseEntity<String> createPose(@RequestParam("file") MultipartFile file,@PathVariable("fileName") String name) throws IOException {
        // path 설정
        String uploadedAddress = s3Util.createAndUploadPoseFile(file, "poseType"+name);
        return ResponseEntity.ok().body(uploadedAddress);
    }
}
