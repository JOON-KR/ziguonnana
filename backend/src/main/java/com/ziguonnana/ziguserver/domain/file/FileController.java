package com.ziguonnana.ziguserver.domain.file;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ziguonnana.ziguserver.util.S3Util;
import com.ziguonnana.ziguserver.websocket.art.service.ArtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final S3Util s3Util;
    private final ArtService artService;

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
//    @PostMapping("/test")
//    public ResponseEntity<String> createPose(
//            @RequestParam("imageKey") String imageKey,
//            @RequestParam("roomId") String roomId,
//            @RequestParam("playerId") int playerId) throws IOException {
//        
//        // cropAndMakeBackgroundTransparent 메서드 호출
//        String resultUrl = artService.cropAndMakeBackgroundTransparent(imageKey, roomId, playerId);
//        
//        if (resultUrl != null) {
//            return ResponseEntity.ok().body(resultUrl);
//        } else {
//            return ResponseEntity.status(500).body("Error processing image");
//        }
//    }
}
