package com.ziguonnana.ziguserver.websocket.listener;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import com.ziguonnana.ziguserver.websocket.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.dto.Room;
import com.ziguonnana.ziguserver.websocket.dto.SaveArtEvent;
import com.ziguonnana.ziguserver.websocket.service.WebsocketService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final WebsocketService websocketService;
    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        // Handle connection event if needed
        log.info("Received a new WebSocket connection: " + sessionId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        log.info("Disconnected WebSocket session: " + sessionId);

        // handleDisconnect 호출
        websocketService.handleDisconnect(sessionId);
    }

    @EventListener
    public void handleSaveArtEvent(SaveArtEvent event) {
        String roomId = event.getRoomId();
        RelayArt art = event.getArt();

        websocketService.relay(roomId, art);

        Room room = websocketService.getRoom(roomId);
        room.countUp();

        if (room.getCount() == room.getPeople()) {
            // 그림 전파 함수 호출
            Map<Integer, RelayArt> artMap = websocketService.artResponse(roomId);
            messagingTemplate.convertAndSend("/topic/game/" + roomId, artMap);

            // 카운트 초기화 및 사이클 증가
            room.countInit();
            room.cycleUp();

            // 사이클이 people - 1에 도달하면 isRelay를 true로 설정
            if (room.getCycle() == room.getPeople() - 1) {
                room.relayEnd();
                room.countInit();
            }
        }

        // 상태 업데이트 후 클라이언트에 브로드캐스트
        GameMessage<Room> message = GameMessage.info("이어그리기 종료", room);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, message);
    }
}
