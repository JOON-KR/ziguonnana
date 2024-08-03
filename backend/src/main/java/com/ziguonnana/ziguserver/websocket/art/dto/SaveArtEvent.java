package com.ziguonnana.ziguserver.websocket.art.dto;

public class SaveArtEvent {
    private final String roomId;
    private final RelayArt art;

    public SaveArtEvent(String roomId, RelayArt art) {
        this.roomId = roomId;
        this.art = art;
    }

    public String getRoomId() {
        return roomId;
    }

    public RelayArt getArt() {
        return art;
    }
}
