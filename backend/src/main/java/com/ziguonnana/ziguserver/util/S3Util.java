package com.ziguonnana.ziguserver.util;

import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ziguonnana.ziguserver.websocket.global.dto.Position;

import io.awspring.cloud.s3.ObjectMetadata;
import io.awspring.cloud.s3.S3Operations;
import io.awspring.cloud.s3.S3Resource;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class S3Util {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String BUCKET;
    private final S3Operations s3Operations;

    public S3Util(S3Operations s3Operations) {
        this.s3Operations = s3Operations;
    }

    // key : path/uuid + index
    @Transactional
    public String uploadSplitedVideo(MultipartFile file, String path, int index) throws IOException {
        String uniqueID = UUID.randomUUID().toString();
        String extension = extractExtension(file.getOriginalFilename());
        String key = path + uniqueID + "-" + index + extension;
        log.info("upload key: " + key);
        S3Resource resource;
        try (InputStream inputStream = file.getInputStream()) {
            resource = s3Operations.upload(BUCKET, key, inputStream,
                    ObjectMetadata.builder().contentType(file.getContentType()).build());
        }

        log.debug("splitedVideo url : " + resource.getURL());
        return key;
    }

    @Transactional
    public String uploadVideo(File file, String path) throws IOException {
        String uuid = generateUniqueFileName(file.getName());
        String key = path + uuid;
        log.info(key);
        S3Resource resource;
        try (InputStream inputStream = new FileInputStream(file)) {
            resource = s3Operations.upload(BUCKET, key, inputStream,
                    ObjectMetadata.builder() //메타데이터 설정
                    .contentType("video/webm")
                    .contentDisposition("inline")
                    .build());
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        log.debug("image url : " + resource.getURL());
        return key;
    }

    // key : path/uuid
    @Transactional
    public String upload(MultipartFile file, String path) throws IOException {
        String uuid = generateUniqueFileName(file.getOriginalFilename());
        String key = path + uuid;
        log.info("upload key: " + key);
        S3Resource resource;
        try (InputStream inputStream = file.getInputStream()) {
            resource = s3Operations.upload(BUCKET, key, inputStream,
                    ObjectMetadata.builder().contentType(file.getContentType()).build());
        }

        log.debug("image url : " + resource.getURL());
        return key;
    }

    @Transactional
    public void deleteImageFromS3(String imageAddress) {
        System.out.println("delete from S3: " + imageAddress);
        s3Operations.deleteObject(BUCKET, imageAddress);
    }

    /**
     * 파일이름이 겹치지 않기 위한 유니크한 파일 이름을 만들어주는 함수
     *
     * @param originalFileName 업로드하는 파일의 원본 이름
     * @return uuid
     */
    private String generateUniqueFileName(String originalFileName) {
        String extension = extractExtension(originalFileName);

        // UUID를 사용하여 랜덤값을 생성하고, 확장자와 합쳐서 고유한 파일 이름을 생성
        String uniqueID = UUID.randomUUID().toString();
        return uniqueID + extension;
    }

    // 확장자 추출 메소드
    private String extractExtension(String originalFileName) {
        String extension = "";
        int lastDotIndex = originalFileName.lastIndexOf(".");
        if (lastDotIndex >= 0) {
            extension = originalFileName.substring(lastDotIndex);
        }
        return extension;
    }

    @Transactional
    public String createAndUploadPoseFile(MultipartFile imageFile, String fileName) throws IOException {
        // 이미지 파일을 BufferedImage로 변환
        BufferedImage image = ImageIO.read(imageFile.getInputStream());

        // 이미지의 크기를 640x480으로 리사이즈
        BufferedImage resizedImage = resizeImage(image, 640, 480);

        // 이미지에서 포인트 추출
        List<Position> points = extractPointsFromImage(resizedImage);

        // 포인트 데이터를 텍스트 파일로 저장
        File tempFile = createTempFile(points);

        // 텍스트 파일을 S3에 업로드
        String key = "pose/" + fileName + ".txt";
        try (InputStream inputStream = new FileInputStream(tempFile)) {
            s3Operations.upload(BUCKET, key, inputStream);
            upload(imageFile, "/pose");
        }

        // 임시 파일 삭제
        tempFile.delete();

        return key;
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int width, int height) {
        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        resizedImage.getGraphics().drawImage(originalImage, 0, 0, width, height, null);
        return resizedImage;
    }

    private List<Position> extractPointsFromImage(BufferedImage image) {
        List<Position> points = new ArrayList<>();

        int width = image.getWidth();
        int height = image.getHeight();

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int pixel = image.getRGB(x, y);

                // 알파값을 제외한 RGB 값 추출
                int red = (pixel >> 16) & 0xff;
                int green = (pixel >> 8) & 0xff;
                int blue = pixel & 0xff;

                // 만약 픽셀이 투명하지 않고 색상이 있다면 해당 좌표를 포지션으로 저장
                if (red != 255 || green != 255 || blue != 255) {
                    points.add(new Position(x, y));
                }
            }
        }

        return points;
    }

    private File createTempFile(List<Position> points) throws IOException {
        File tempFile = File.createTempFile("pose_points", ".txt");
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile))) {
            for (Position point : points) {
                writer.write(point.getX() + "," + point.getY());
                writer.newLine();
            }
        }
        return tempFile;
    }
    
    public InputStream downloadFile(String key) {
        try {
            return s3Operations.download("ziguonnana", key).getInputStream();
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file from S3: " + key, e);
        }
    }
}
