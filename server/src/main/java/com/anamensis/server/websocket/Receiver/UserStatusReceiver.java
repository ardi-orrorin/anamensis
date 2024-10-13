package com.anamensis.server.websocket.Receiver;

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

import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserStatusReceiver {


    private final UserService userService;

    public Mono<WebSocketMessage> getUserList(WebSocketSession session, Set<SessionUser> sessionList) {
        List<String> userList = sessionList.stream()
            .map(SessionUser::username)
            .toList();

        AtomicReference<JSONObject> json = new AtomicReference<>();

        return userService.findMemberByUsernames(userList)
            .flatMapMany(list -> {
                List<UserStatus> userStatusList = list.stream()
                    .map(memberResultMap -> {

                        String profileImage = memberResultMap.getFile().getFilePath() != null
                            ? memberResultMap.getFile().getFilePath() + memberResultMap.getFile().getFileName()
                            : "";

                        return UserStatus.builder()
                                .username(memberResultMap.getMember().getUserId())
                                .status(Status.ONLINE)
                                .profileImage(profileImage)
                                .build();
                        }
                    ).toList();

                WebSocketResponse<List<UserStatus>> res = WebSocketResponse.<List<UserStatus>>builder()
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
        Status status,
        Set<SessionUser> sessionList
    ) {

        SessionUser user = sessionList.stream()
            .filter(sessionUser ->
                sessionUser.username().equals(username)
            ).findFirst()
            .orElse(null);

        if(user == null) return Mono.empty();

        sessionList.remove(user);

        sessionList.add(new SessionUser(
            user.username(),
            status,
            user.roles(),
            user.session()
        ));

        UserStatus userStatus = UserStatus.builder()
            .username(username)
            .status(status)
            .build();

        WebSocketResponse<UserStatus> res = WebSocketResponse.<UserStatus>builder()
            .type(ResponseType.STATUS)
            .data(userStatus)
            .build();

        JSONObject json = new JSONObject(res);

        return Flux.fromIterable(sessionList)
            .flatMap(session ->
                session.session()
                    .send(Mono.just(session.session().textMessage(json.toString())))
            )
            .then();
    }
}
