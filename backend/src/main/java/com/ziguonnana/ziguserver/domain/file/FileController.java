package com.ziguonnana.ziguserver.domain.file;

import com.ziguonnana.ziguserver.util.S3Util;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
public class FileController {

    private final S3Util s3Util;

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        //path는 알아서 설정하기
        String uploadedAddress = s3Util.upload(file, "shortsExample/");
        return ResponseEntity.ok().body(uploadedAddress);
    }

    @DeleteMapping("{imageAddress}")
    public ResponseEntity<String> deleteFile(@PathVariable("imageAddress") String imageAddress) throws IOException {
        s3Util.deleteImageFromS3(imageAddress);
        return ResponseEntity.ok().build();
    }
}
