package com.anamensis.server.websocket.Receiver;

import com.anamensis.server.entity.Member;
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
                List<UserResponse.UserStatus> userStatusList = list.stream()
                    .map(memberResultMap -> {

                        String profileImage = memberResultMap.getFile().getFilePath() != null
                            ? memberResultMap.getFile().getFilePath() + memberResultMap.getFile().getFileName()
                            : "";

                        Status status = sessionList.stream()
                            .filter(it -> it.username().equals(memberResultMap.getMember().getUserId()))
                            .findFirst()
                            .map(SessionUser::status)
                            .orElse(Status.ONLINE);

                        return UserResponse.UserStatus.builder()
                                .id(memberResultMap.getMember().getId())
                                .username(memberResultMap.getMember().getUserId())
                                .status(status)
                                .profileImage(profileImage)
                                .build();
                        }
                    ).toList();

                WebSocketResponse<List<UserResponse.UserStatus>> res = WebSocketResponse.<List<UserResponse.UserStatus>>builder()
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

        UserResponse.UserStatus userStatus = UserResponse.UserStatus.builder()
            .username(username)
            .status(status)
            .build();

        WebSocketResponse<UserResponse.UserStatus> res = WebSocketResponse.<UserResponse.UserStatus>builder()
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

    public Mono<Void> getUserInfo(
        JSONObject json,
        WebSocketSession session,
        Set<SessionUser> sessionList
    ) {

        String username = json.getString("username");
        return userService.findUserInfo(username)
            .flatMap(userInfoResultMap -> {
                Member member = userInfoResultMap.getMember();

                String profileImage = userInfoResultMap.getFile().getFilePath() != null
                    ? userInfoResultMap.getFile().getFilePath() + userInfoResultMap.getFile().getFileName()
                    : "";

                Status status = sessionList.stream()
                    .filter(it -> it.username().equals(member.getUserId()))
                    .findFirst()
                    .map(SessionUser::status)
                    .orElse(Status.OFFLINE);

                UserResponse.UserInfo userInfo = UserResponse.UserInfo.builder()
                    .id(member.getId())
                    .userId(member.getUserId())
                    .name(member.getName())
                    .email(member.getEmail())
                    .phone(member.getPhone())
                    .point(member.getPoint())
                    .status(status)
                    .profileImage(profileImage)
                    .build();

                WebSocketResponse<UserResponse.UserInfo> res = WebSocketResponse.<UserResponse.UserInfo>builder()
                    .type(ResponseType.USERINFO)
                    .data(userInfo)
                    .build();

                JSONObject resJson = new JSONObject(res);


                return session.send(Mono.just(session.textMessage(resJson.toString())));
            });
    }
}
