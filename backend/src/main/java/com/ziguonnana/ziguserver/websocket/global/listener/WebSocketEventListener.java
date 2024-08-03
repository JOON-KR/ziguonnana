package com.ziguonnana.ziguserver.websocket.global.listener;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.art.dto.SaveArtEvent;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.global.service.WebsocketService;

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
        // 연결 됨
        log.info("Received a new WebSocket connection: " + sessionId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        log.info("Disconnected WebSocket session: " + sessionId);

        // 연결 끊김
        websocketService.handleDisconnect(sessionId);
    }
}
