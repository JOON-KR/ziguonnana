package com.ziguonnana.ziguserver.util;

import io.awspring.cloud.s3.ObjectMetadata;
import io.awspring.cloud.s3.S3Operations;
import io.awspring.cloud.s3.S3Resource;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


@Component
@Slf4j
public class S3Util {
    @Value("${spring.cloud.aws.s3.bucket}")
    private String BUCKET;
    private final S3Operations s3Operations;

    public S3Util(S3Operations s3Operations) {
        this.s3Operations = s3Operations;
    }

    // key : path/uuid
    @Transactional
    public String upload(MultipartFile file, String path) throws IOException {
        String uuid = generateUniqueFileName(file.getOriginalFilename());
        String key = path + uuid;
        S3Resource resource;
        try (InputStream inputStream = file.getInputStream()) {
            resource = s3Operations.upload(BUCKET, key, inputStream,
                    ObjectMetadata.builder().contentType(file.getContentType()).build());
        }

        log.debug("image url : " + resource.getURL());
        return key;
    }

    @Transactional
    public void deleteImageFromS3(String imageAddress){
        System.out.println("delete from S3: " + imageAddress);
        s3Operations.deleteObject(BUCKET,imageAddress);
    }

    /**
     * 파일이름이 겹치지 않기 위한 유니크한 파일 이름을 만들어주는 함수
     * @param originalFileName 업로드하는 파일의 원본 이름
     * @return uuid
     */
    private String generateUniqueFileName(String originalFileName) {
        String extension = "";
        int lastDotIndex = originalFileName.lastIndexOf(".");
        if (lastDotIndex >= 0) {
            extension = originalFileName.substring(lastDotIndex);
        }

        // UUID를 사용하여 랜덤값을 생성하고, 확장자와 합쳐서 고유한 파일 이름을 생성
        String uniqueID = UUID.randomUUID().toString();
        return uniqueID + extension;
    }
}