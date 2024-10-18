package com.anamensis.server.websocket.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class WebSocketResponse<T> {
    private final ResponseType type;
    private final T data;
    private final Instant createdAt = Instant.now();
}
