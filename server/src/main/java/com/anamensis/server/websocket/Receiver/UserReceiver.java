package com.anamensis.server.websocket.Receiver;

import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.service.UserService;
import com.anamensis.server.websocket.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserReceiver {

    private final UserService userService;

    public Mono<WebSocketMessage> getUserList(WebSocketSession session, Set<SessionUser> sessionList) {
        List<String> userList = sessionList.stream()
            .map(SessionUser::username)
            .toList();

        AtomicReference<JSONObject> json = new AtomicReference<>();

        return userService.findMemberByUsernames(userList)
            .flatMapMany(list -> {
                List<UserResponse.ChatUserStatus> userStatusList = list.stream()
                    .map(memberResultMap -> {

                        String profileImage = memberResultMap.getFile().getFilePath() != null
                            ? memberResultMap.getFile().getFilePath() + memberResultMap.getFile().getFileName()
                            : "";

                        Status status = sessionList.stream()
                            .filter(it -> it.username().equals(memberResultMap.getMember().getUserId()))
                            .findFirst()
                            .map(SessionUser::status)
                            .orElse(Status.ONLINE);

                        return UserResponse.ChatUserStatus.builder()
                                .id(memberResultMap.getMember().getId())
                                .username(memberResultMap.getMember().getUserId())
                                .status(status)
                                .profileImage(profileImage)
                                .build();
                        }
                    ).toList();

                WebSocketResponse<List<UserResponse.ChatUserStatus>> res = WebSocketResponse.<List<UserResponse.ChatUserStatus>>builder()
                    .type(ResponseType.USERS)
                    .data(userStatusList)
                    .build();

                json.set(new JSONObject(res));

                return Flux.fromIterable(sessionList.stream().toList());
            })
            .flatMap(sessionUser ->
                sessionUser.session()
                    .send(Mono.just(sessionUser.session().textMessage(json.toString())))
            )
            .then()
            .then(Mono.just(session.textMessage(json.toString())));
    }

    public Mono<Void> changeStatus(
        String username,
        JSONObject json,
        Set<SessionUser> sessionList
    ) {

        SessionUser mySession = sessionList.stream()
            .filter(it -> it.username().equals(username))
            .findFirst()
            .orElse(null);

        if(mySession == null) return Mono.empty();

        if(mySession.status().fromStringEquals(json.getString("status"))) {
            return Mono.empty();
        }

        WebsocketDTO websocketDTO = new WebsocketDTO(
            json.getString("type"),
            0,
            "",
            false,
            json.getString("status"),
            null,
            Instant.now().toString()
        );

        Status status = Status.fromString(websocketDTO.status());

        sessionList.remove(mySession);

        sessionList.add(new SessionUser(
            mySession.username(),
            status,
            mySession.roles(),
            mySession.session()
        ));

        UserResponse.ChatUserStatus userStatus = UserResponse.ChatUserStatus.builder()
            .username(username)
            .status(status)
            .build();

        WebSocketResponse<UserResponse.ChatUserStatus> res = WebSocketResponse.<UserResponse.ChatUserStatus>builder()
            .type(ResponseType.STATUS)
            .data(userStatus)
            .build();

        JSONObject resJson = new JSONObject(res);

        return Flux.fromIterable(sessionList)
            .flatMap(session ->
                session.session()
                    .send(Mono.just(session.session().textMessage(resJson.toString())))
            )
            .then();
    }
}
