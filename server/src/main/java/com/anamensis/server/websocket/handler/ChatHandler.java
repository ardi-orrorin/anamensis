package com.anamensis.server.websocket.handler;

import com.anamensis.server.dto.ChatType;
import com.anamensis.server.dto.UserDto;
import com.anamensis.server.websocket.Receiver.ChatReceiver;
import com.anamensis.server.websocket.Receiver.UserReceiver;
import com.anamensis.server.websocket.dto.SessionUser;
import com.anamensis.server.websocket.dto.Status;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ChatHandler implements WebSocketHandler {

    private final ChatReceiver chatReceiver;

    private final UserReceiver userReceiver;

    private final Set<SessionUser> sessionList = new HashSet<>();

    private Logger log = LoggerFactory.getLogger(ChatHandler.class);

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext ->
                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
                    .cast(UserDto.class)
                    .flatMap(user -> {
                        SessionUser sessionUser = new SessionUser(user.username(), Status.ONLINE, user.authorities(), session);

                        sessionList.add(sessionUser);

                        log.info("sessionList: {}", sessionList);

                        return session.send(userReceiver.getUserList(session, sessionList))
                            .and(chatReceiver.getChatRoomList(user.getUsername(), session))
                            .and(this.receive(session))
                            .then()
                            .doFinally(it -> this.close(user.getUsername(), session).subscribe());
                    })
            );
    }

    private Mono<Void> receive(WebSocketSession session) {
        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext ->
                Mono.justOrEmpty(securityContext.getAuthentication().getPrincipal())
                    .cast(UserDto.class)
                    .flatMap(user ->
                        session.receive()
                            .flatMap(message -> {
                                JSONObject json = new JSONObject(message.getPayloadAsText());
                                String username = user.getUsername();

                                return switch (ChatType.fromString(json.getString("type"))) {
                                    case CHAT           -> chatReceiver.sendMessage(username, json, sessionList);
                                    case CHAT_ROOM_LIST -> chatReceiver.getChatRoomList(username, session);
                                    case CHAT_MESSAGE   -> chatReceiver.getChatMessages(json, session);
                                    case STATUS         -> userReceiver.changeStatus(username, json, sessionList);
                                    case null,
                                         default        -> Mono.empty();
                                };
                            })
                            .then()
                    )
            );
    }

    private Mono<Void> close(String username, WebSocketSession session) {
        sessionList.removeIf(it -> it.username().equals(username));

        if(sessionList.isEmpty()) {
            return Mono.empty();
        }

        return session.send(userReceiver.getUserList(session, sessionList))
            .then();
    }


}
