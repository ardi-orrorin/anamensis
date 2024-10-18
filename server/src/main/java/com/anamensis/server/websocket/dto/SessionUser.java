package com.anamensis.server.websocket.dto;

import com.anamensis.server.entity.RoleType;
import org.springframework.web.reactive.socket.WebSocketSession;

import java.util.List;

public record SessionUser(
    String username,
    Status status,
    List<RoleType> roles,
    WebSocketSession session
) {}
