package com.ziguonnana.ziguserver.websocket.publisher;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.websocket.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.dto.SaveArtEvent;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SaveArtPublisher {
    private final ApplicationEventPublisher publisher;

    public void publishSaveArtEvent(String roomId, RelayArt art) {
        SaveArtEvent event = new SaveArtEvent(roomId, art);
        publisher.publishEvent(event);
    }
}
