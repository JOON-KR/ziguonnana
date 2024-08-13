package com.ziguonnana.ziguserver.websocket.art.service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import com.ziguonnana.ziguserver.websocket.art.dto.ArtResponse;
import com.ziguonnana.ziguserver.websocket.art.dto.AvatarResult;
import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.nickname.dto.Nickname;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;


@RequiredArgsConstructor
@Service
@Slf4j
public class ArtService {
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final S3Client s3Client;
    private final String DEFAULT_IMAGE = "";

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    // 키워드 리스트 맵 전파
    public void spreadKeyword(String roomId) {
        Room room = roomRepository.getRoom(roomId);
        createRandomKeyword(room);
        log.info("spreadKeword 전파");
        messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), Response.ok(CommandType.ART_START, true));
    }

    public void createRandomKeyword(Room room) {
        ConcurrentMap<Integer, Player> players = room.getPlayers();
        int people = room.getPeople();

        for (int i = 1; i <= people; i++) {
            Player player = players.get(i);
            List<String> combinedList = new ArrayList<>();

            List<String> feature = player.getProfile().getFeature();
            List<String> answer = player.getAnswer();
            combinedList.addAll(feature);
            combinedList.addAll(answer);

            // 중복을 허용하지 않기 위해 Set을 사용
            Set<String> uniqueSelections = new HashSet<>();
            Random random = new Random();

            while (uniqueSelections.size() <= 6 && !combinedList.isEmpty()) {
                String randomSelection = combinedList.get(random.nextInt(combinedList.size()));
                uniqueSelections.add(randomSelection);
            }

            // Set을 List로 변환하여 플레이어의 번호를 키로 하고 맵에 추가
            player.createAnswer(new ArrayList<>(uniqueSelections));
        }
        log.info("----이어그리기 랜덤 키워드 생성  : {}", players);
    }

    // 그림 저장 후 응답전달
    public void save(String roomId, String art) {
        Room room = roomRepository.getRoom(roomId);
        int cycle = room.getCycle();
        int people = room.getPeople();
        if (cycle >= people) {
            return;
        }
        ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
        int targetUser = cycle + 1;
        int userNo = (targetUser + room.getCount()) % people == 0 ? people : (targetUser + room.getCount()) % people;
        // 저장
        // 첫번째 카운트 (다음사람이 첫번째로 그릴 수 있게 반환)
        if (room.getCount() == 0) {
            if (userNo == people) userNo = 1;
            else userNo++;
            String keyword = room.getPlayers().get(targetUser).getAnswer().get(0);
            ArtResponse response = ArtResponse.builder()
                    .art(DEFAULT_IMAGE)
                    .currentUser(userNo)
                    .targetUser(targetUser)
                    .keyword(keyword)
                    .build();
            log.info("----{}번째 사이클 시작 -------", cycle + 1);
            log.info("---- targetUser : {}, currentUser : {}, art: {}", response.getTargetUser(), response.getCurrentUser(), response.getArt());
            // 저장안하고 다음 타겟 및 그릴사람 반환
            messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), Response.ok(CommandType.ART_RELAY, response));
            room.countUp();
            return;
        }
        log.info("----그림저장 --- targetUser : {}, currentUser : {}", targetUser, userNo);
        // 현재 전달받은 그림 타겟에 저장
        List<RelayArt> artList = map.get(targetUser);
        RelayArt relayArt = RelayArt.builder()
                .art(art)
                .num(userNo)
                .keyword(room.getPlayers().get(targetUser).getAnswer().get(room.getCount() - 1))
                .build();
        artList.add(relayArt);
        // 세이브 카운트 업
        room.countUp();
        // 사이클이 끝나면 사이클업
        if (room.getCount() >= people) {
            log.info("----{}번 사이클 종료 ", cycle + 1);
            room.cycleUp();
            room.countInit();
            // 이어그리기 끝나면
            if (room.getCycle() == people) {
                endRelay(roomId);
                return;
            }
            // 사이클만 끝나면
            messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), Response.ok(CommandType.ART_CYCLE, true));
            save(roomId, DEFAULT_IMAGE);
            return;
        }
        ArtResponse response = ArtResponse.builder()
                .art(art)
                .currentUser(userNo + 1 == people ? people : (userNo + 1) % people)
                .targetUser(targetUser)
                .keyword(room.getPlayers().get(targetUser).getAnswer().get(room.getCount()))
                .build();

        log.info("----다음 그림 반환 : targetUser : {}, currentUser : {}, art: {}", response.getTargetUser(), response.getCurrentUser(), response.getArt());
        messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), Response.ok(CommandType.ART_RELAY, response));
    }

    private void endRelay(String roomId) {
        Room room = roomRepository.getRoom(roomId);
        ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
        // 결과 전송
        Response<ConcurrentMap<Integer, List<RelayArt>>> endResponse = Response.ok(CommandType.ART_END, map);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, endResponse);
        log.info("그림 그리기 결과 :: roomId : {}, art : {} ", roomId, endResponse.getData());
        // 아바타 결과 반환
        spreadAvatarCard(roomId);
        room.cycleInit();
        room.countInit();
    }

    // 아바타 명함 전송
    public void spreadAvatarCard(String roomId) {
        Room room = roomRepository.getRoom(roomId);
        ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
        int people = room.getPeople();
        ConcurrentMap<Integer, AvatarResult> cards = new ConcurrentHashMap<>();
        ConcurrentMap<Integer, Player>players = room.getPlayers();
        for (int i = 1; i <= people; i++) {
            List<RelayArt> tmp = map.get(i);

            if (tmp != null && !tmp.isEmpty()) {
                RelayArt art = tmp.get(tmp.size() - 1);
                List<String> answer = room.getPlayers().get(i).getAnswer();
                List<String> features = new ArrayList<>();
                for (int j = 0; j < 3; j++) {
                    features.add(answer.get(i));
                }

                // 기존 이미지를 가운데 부분만 남기고 나머지 영역을 투명하게 변경
                String newImageUrl = cropAndMakeBackgroundTransparent(art.getArt(), roomId, i);

                AvatarResult card = AvatarResult.builder()
                        .avatarImage(newImageUrl) // 새로 생성한 이미지 URL 사용
                        .features(features)
                        .nickname(players.get(i).getNickname())
                        .build();
                cards.put(i, card);
            }
        }
        Response<ConcurrentMap<Integer, AvatarResult>> cardMessage = Response.ok(CommandType.AVATAR_CARD, cards);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, cardMessage);
        log.info("아바타 명함 :: roomId : {}, avatarCard : {} ", roomId, cardMessage);
    }

    public String cropAndMakeBackgroundTransparent(String imageKey, String roomId, int playerId) {
        try {
            log.info("s3이미지 경로:{}", imageKey);
            
            // 따옴표가 있는 경우 제거
            if (imageKey.startsWith("\"") && imageKey.endsWith("\"")) {
                imageKey = imageKey.substring(1, imageKey.length() - 1);
            }

            if (imageKey.startsWith("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/")) {
                imageKey = imageKey.replace("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/", "");
            }

            // S3에서 이미지 로드
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(imageKey)
                    .build();

            InputStream s3ObjectInputStream = s3Client.getObject(getObjectRequest);

            BufferedImage originalImage = ImageIO.read(s3ObjectInputStream);

            // 이미지 크기
            int width = originalImage.getWidth();
            int height = originalImage.getHeight();
            int diameter = Math.min(width, height); // 원의 지름

            // 원형 이미지를 위한 BufferedImage 생성 (투명한 배경)
            BufferedImage newImage = new BufferedImage(diameter, diameter, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = newImage.createGraphics();

            // 안티앨리어싱 적용
            g2d.setRenderingHint(java.awt.RenderingHints.KEY_ANTIALIASING, java.awt.RenderingHints.VALUE_ANTIALIAS_ON);

            // 원형 클리핑
            g2d.setClip(new java.awt.geom.Ellipse2D.Float(0, 0, diameter, diameter));

            // 원형 내에 이미지를 중앙에 맞춰서 그리기
            int x = (width - diameter) / 2;
            int y = (height - diameter) / 2;
            g2d.drawImage(originalImage, -x, -y, null);

            g2d.dispose();

            // S3에 업로드하기 위한 ByteArrayOutputStream 생성
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(newImage, "png", os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());

            // S3에 업로드
            String key = roomId + "/" + playerId + "_AVATAR.png";
            s3Client.putObject(PutObjectRequest.builder().bucket(bucket).key(key).build(), RequestBody.fromInputStream(is, os.size()));

            // S3 URL 반환
            return "https://" + bucket + ".s3.amazonaws.com/" + key;

        } catch (IOException e) {
            log.error("이미지 처리 중 오류 발생: ", e);
            return null;
        }
    }

    public void start(String roomId, String image) {
        Room room = roomRepository.getRoom(roomId);
        log.info("이어그리기 시작 요청 =============");
        room.countUp();
        if (room.getCount() >= room.getPeople()) {
            room.countInit();
            room.cycleInit();
            save(roomId, DEFAULT_IMAGE);
        }
    }
    
    public boolean vaild(String roomId) {
        Room room = roomRepository.getRoom(roomId);
        room.relayEnd();
        return false;
    }
}
