package com.ziguonnana.ziguserver.websocket.result.service;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.domain.records.entity.AvatarCard;
import com.ziguonnana.ziguserver.websocket.art.dto.AvatarResult;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;
import com.ziguonnana.ziguserver.websocket.result.dto.GameResult;

import io.awspring.cloud.s3.ObjectMetadata;
import io.awspring.cloud.s3.S3Operations;
import io.awspring.cloud.s3.S3Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class GameResultService {

    private final RoomRepository roomRepository;
    private final S3Operations s3Operations;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String BUCKET;

    @Value("${S3.baseURL}")
    private String s3BaseURL;

    private static final int[][] COORDINATES = {
        {327, 160}, // 1번 사람
        {327, 240}, // 2번 사람
        {223, 145}, // 3번 사람
        {420, 150}, // 4번 사람
        {75, 120},  // 5번 사람
        {573, 112}  // 6번 사람
    };

    public GameResult getGameResult(String roomId) {
        Room room = roomRepository.getRoom(roomId);
        return room.makeGameResult();
    }

    public String processAndUploadAvatarImage(String roomId) {
        try {
        	Room room = roomRepository.getRoom(roomId);
        	List<AvatarResult> avatarCards = room.makeGameResult().getAvatarCards();
            // 원본 이미지 로드
            BufferedImage baseImage = ImageIO.read(new URL(s3BaseURL + "RESULT/49047748-c5e9-4576-8261-655e96bc1c27.png"));

            // 아바타 이미지를 하나씩 덮어씌우기
            for (int i = 0; i < avatarCards.size() && i < COORDINATES.length; i++) {
                AvatarResult avatarResult = avatarCards.get(i);
                BufferedImage overlayImage = ImageIO.read(new URL(avatarResult.getAvatarImage()));
                overlayImage(baseImage, overlayImage, i + 1);
            }

            // 최종 이미지를 S3에 업로드하고 URL 반환
            return uploadToS3(baseImage);

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to process and upload avatar image");
        }
    }

    private void overlayImage(BufferedImage baseImage, BufferedImage overlayImage, int number) {
        if (number < 1 || number > COORDINATES.length) {
            throw new IllegalArgumentException("Invalid number. Must be between 1 and " + COORDINATES.length);
        }

        int[] coords = COORDINATES[number - 1];

        int overlayWidth = 38;
        int overlayHeight = 38;

        // 이미지 리사이징 (고품질 리사이징)
        Image tempImage = overlayImage.getScaledInstance(overlayWidth, overlayHeight, Image.SCALE_SMOOTH);
        BufferedImage resizedOverlayImage = new BufferedImage(overlayWidth, overlayHeight, BufferedImage.TYPE_INT_ARGB);

        Graphics2D g2d = resizedOverlayImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.drawImage(tempImage, 0, 0, null);
        g2d.dispose();

        // 이미지를 지정된 좌표에 덮어씌우기
        g2d = baseImage.createGraphics();
        g2d.drawImage(resizedOverlayImage, coords[0] - overlayWidth / 2, coords[1] - overlayHeight / 2, null);
        g2d.dispose();
    }

    private String uploadToS3(BufferedImage finalImage) throws IOException {
        // 최종 이미지를 ByteArrayOutputStream에 저장
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(finalImage, "png", os);
        byte[] imageBytes = os.toByteArray();

        // S3에 업로드할 파일명 생성
        String fileName = "RESULT/" + UUID.randomUUID() + ".png";

        // S3에 업로드
        InputStream inputStream = new ByteArrayInputStream(imageBytes);
        S3Resource resource = s3Operations.upload(BUCKET, fileName, inputStream,
                ObjectMetadata.builder()
                        .contentType("image/png")
                        .build());

        // 업로드된 파일의 URL 반환
        return resource.getURL().toString();
    }
}
