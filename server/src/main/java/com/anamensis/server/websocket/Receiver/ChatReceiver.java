package com.anamensis.server.websocket.Receiver;

import com.anamensis.server.dto.response.ChatMessageResponse;
import com.anamensis.server.dto.response.ChatRoomResponse;
import com.anamensis.server.entity.ChatMessage;
import com.anamensis.server.entity.Member;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import com.anamensis.server.service.ChatMessageService;
import com.anamensis.server.service.ChatRoomService;
import com.anamensis.server.service.UserService;
import com.anamensis.server.websocket.dto.ResponseType;
import com.anamensis.server.websocket.dto.SessionUser;
import com.anamensis.server.websocket.dto.WebSocketResponse;
import com.anamensis.server.websocket.dto.WebsocketDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatReceiver {

    private final UserService userService;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;

    public Mono<Void> getChatRoomList(
        String username,
        WebSocketSession session
    ) {
        return chatRoomService.selectAllByUsername(username)
            .flatMap(list -> {

                WebSocketResponse<List<ChatRoomResponse.ListItem>> res = WebSocketResponse.<List<ChatRoomResponse.ListItem>>builder()
                    .type(ResponseType.CHATLIST)
                    .data(list)
                    .build();

                JSONObject resJson = new JSONObject(res);

                return session.send(Mono.just(session.textMessage(resJson.toString())));
        });
    }

    public Mono<Void> receiver(
        String username,
        JSONObject json,
        Set<SessionUser> sessionUserList
    ) {
        WebsocketDTO websocketDTO = new WebsocketDTO(
            json.getString("type"),
            json.getLong("routeId"),
            json.getString("content"),
            json.getBoolean("inputting"),
            json.getString("status"),
            null,
            Instant.now().toString()
        );

        Mono<Member> member = userService.findUserByUserId(username)
            .share();

        Mono<ChatRoomResultMap.ChatRoom> chatRoom = chatRoomService.selectById(websocketDTO.routeId())
            .map(Optional::get)
            .share();

        Mono<ChatMessage> chat = member.flatMap(m -> {
            ChatMessage chatMessage = new ChatMessage(
            0L,
                websocketDTO.routeId(),
                m.getId(),
                websocketDTO.content(),
                Instant.now(),
                false,
                null
                );
            return chatMessageService.save(chatMessage);
        })
        .share();

        return chatRoom
            .flatMapMany( chatRoom1 -> {
                List<String> users = chatRoom1.getParticipants().stream()
                    .map(Member::getUserId).toList();

                List<SessionUser> connectedUser = sessionUserList.stream()
                    .filter( it -> users.contains(it.username()))
                    .toList();

                return Flux.fromIterable(connectedUser);
            })
            .zipWith(chat)
            .flatMap( tuple2 -> {
                SessionUser sessionUser = tuple2.getT1();
                ChatMessage chatMessage = tuple2.getT2();

                ChatMessageResponse.ChatMessage resChatMessage = new ChatMessageResponse().from(
                    websocketDTO.routeId(),
                    websocketDTO.inputting(),
                    true,
                    username,
                    chatMessage
                );

                WebSocketResponse<ChatMessageResponse.ChatMessage> res  = WebSocketResponse.<ChatMessageResponse.ChatMessage>builder()
                    .type(ResponseType.CHAT)
                    .data(resChatMessage)
                    .build();

                JSONObject resJson = new JSONObject(res);

                return sessionUser.session()
                    .send(Mono.just(sessionUser.session().textMessage(resJson.toString())));
            })
            .then();

    }
}
