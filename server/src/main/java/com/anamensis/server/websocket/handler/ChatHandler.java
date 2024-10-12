package com.anamensis.server.websocket.handler;

import com.anamensis.server.dto.ChatType;
import com.anamensis.server.dto.UserDto;
import com.anamensis.server.websocket.Receiver.ChatReceiver;
import com.anamensis.server.websocket.dto.SessionUser;
import com.anamensis.server.websocket.dto.WebsocketDTO;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.*;

@Component
@RequiredArgsConstructor
public class ChatHandler implements WebSocketHandler {

    private final ChatReceiver chatReceiver;

    private final Map<String, Set<SessionUser>> sessionList = new HashMap<>();

    private Logger log = org.slf4j.LoggerFactory.getLogger(ChatHandler.class);

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext ->
                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
                    .cast(UserDto.class)
                    .flatMap(user -> {
                        String[] pathSplit = session.getHandshakeInfo().getUri().getPath().split("/");
                        String router = pathSplit[pathSplit.length - 1];
                        SessionUser sessionUser = new SessionUser(user.username(), user.authorities(), session);

                        if(sessionList.get(router) != null) {
                            sessionList.get(router).add(sessionUser);
                        } else {
                            sessionList.put(router, new HashSet<>());
                            sessionList.get(router).add(sessionUser);
                        }

                        return session.send(this.init(session))
                            .and(this.receive(session))
                            .then()
                            .doAfterTerminate(() -> this.close(router, sessionUser));
                    })
            );
    }

    public Mono<WebSocketMessage> init(WebSocketSession session) {
        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext ->
                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
                    .cast(UserDto.class)
                    .flatMap(user -> {
                        String message = String.format("User %s WebSocket Connected", user.username());
                        return Mono.just(session.textMessage(message));
                    })
                );
    }

    public Mono<Void> receive(WebSocketSession session) {
        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext ->
                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
                    .cast(UserDto.class)
                    .flatMap(user ->
                        session.receive()
                            .flatMap(message -> {
                                JSONObject json = new JSONObject(message.getPayloadAsText());

                                WebsocketDTO websocketDTO = new WebsocketDTO(
                                    json.getString("type"),
                                    json.getLong("routeId"),
                                    json.getString("content"),
                                    json.getBoolean("inputting"),
                                    null,
                                    Instant.now().toString()
                                );

                                List<SessionUser> users = sessionList.entrySet().stream()
                                    .map(Map.Entry::getValue)
                                    .flatMap(Collection::stream)
                                    .toList();

                                if(ChatType.CHAT.fromStringEquals(websocketDTO.type())) {
                                    return chatReceiver.receiver(
                                        user.getUsername(),
                                        websocketDTO,
                                        users
                                    );
                                }

                                return Mono.empty();
                            })
                            .then()
                    )
            );
    }

    public Mono<Void> close(String router, SessionUser sessionUser) {
        sessionList.get(router).remove(sessionUser);
        if(sessionList.get(router).isEmpty()) {
            sessionList.remove(router);
        }

        return Mono.empty();
    }


}
