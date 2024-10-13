package com.anamensis.server.websocket.handler;

import com.anamensis.server.dto.ChatType;
import com.anamensis.server.dto.UserDto;
import com.anamensis.server.websocket.Receiver.ChatReceiver;
import com.anamensis.server.websocket.Receiver.UserStatusReceiver;
import com.anamensis.server.websocket.dto.*;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Instant;
import java.util.*;

@Component
@RequiredArgsConstructor
public class ChatHandler implements WebSocketHandler {

    private final ChatReceiver chatReceiver;

    private final UserStatusReceiver statusReceiver;

    private final Set<SessionUser> sessionList = new HashSet<>();

    private Logger log = org.slf4j.LoggerFactory.getLogger(ChatHandler.class);

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext ->
                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
                    .cast(UserDto.class)
                    .flatMap(user -> {
                        SessionUser sessionUser = new SessionUser(user.username(), Status.ONLINE, user.authorities(), session);

                        sessionList.add(sessionUser);

                        return session.send(statusReceiver.getUserList(session, sessionList))
                            .and(this.receive(session))
                            .then()
                            .doAfterTerminate(() -> this.close(sessionUser, session).subscribe());
                    })
            );
    }

//    private Mono<WebSocketMessage> init(WebSocketSession session) {
//        return ReactiveSecurityContextHolder.getContext()
//            .flatMap(securityContext ->
//                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
//                    .cast(UserDto.class)
//                    .flatMap(user -> {
//                        String message = String.format("User %s WebSocket Connected", user.username());
//
//                        WebSocketResponse<String> res = WebSocketResponse.<String>builder()
//                            .type(ResponseType.SYSTEM)
//                            .data(message)
//                            .build();
//
//                        JSONObject json = new JSONObject(res);
//
//                        return Mono.just(session.textMessage(json.toString()));
//                    })
//                );
//    }

    private Mono<Void> receive(WebSocketSession session) {
        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext ->
                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
                    .cast(UserDto.class)
                    .flatMap(user ->
                        session.receive()
                            .flatMap(message -> {
                                JSONObject json = new JSONObject(message.getPayloadAsText());

                                if(ChatType.CHAT.fromStringEquals(json.getString("type"))) {
                                    return chatReceiver.receiver(
                                        user.getUsername(),
                                        json,
                                        sessionList
                                    );
                                }

                                if(ChatType.STATUS.fromStringEquals(json.getString("type"))) {
                                    return changeUserStatus(user, json, sessionList);
                                }

                                return Mono.empty();
                            })
                            .then()
                    )
            );
    }

    private Mono<Void> changeUserStatus(
        UserDto user,
        JSONObject json,
        Set<SessionUser> sessionList
    ) {

        WebsocketDTO websocketDTO = new WebsocketDTO(
            json.getString("type"),
            0,
            "",
            false,
            json.getString("status"),
            null,
            Instant.now().toString()
        );

        SessionUser mySession = sessionList.stream()
            .filter(it -> it.username().equals(user.getUsername()))
            .findFirst()
            .orElseThrow();

        if(!mySession.status().fromStringEquals(websocketDTO.status())) {
            return statusReceiver.changeStatus(
                user.getUsername(),
                Status.fromString(websocketDTO.status()),
                sessionList
            );
        }

        return Mono.empty();
    }

    private Mono<Void> close(SessionUser sessionUser, WebSocketSession session) {
        sessionList.remove(sessionUser);
        return session.send(statusReceiver.getUserList(session, sessionList))
            .then();
    }


}
