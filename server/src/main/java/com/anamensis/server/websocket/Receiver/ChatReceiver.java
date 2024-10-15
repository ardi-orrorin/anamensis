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
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

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

//    public Mono<Void> getChatRoom(
//        String username,
//        JSONObject json,
//        WebSocketSession session
//    ) {
//        String partner = json.getString("username");
//
//        AtomicBoolean isChatRoomExist = new AtomicBoolean(true);
//
//        return chatRoomService.hasChatRoomWithBothUsers(username, partner)
//            .flatMap( chatRoomId -> {
//                if (chatRoomId != 0) return Mono.just(chatRoomId);
//
//                ChatRoomRequest.Create request = new ChatRoomRequest.Create(
//                    "대화방",
//                    username,
//                    List.of(username, partner),
//                    RoomType.PRIVATE
//                );
//
//                return chatRoomService.save(request, username)
//                    .flatMap(it -> {
//                        isChatRoomExist.set(false);
//                        return Mono.just(it.getId());
//                    });
//            })
//            .flatMap( chatRoomId -> {
//                WebSocketResponse<Long> res = WebSocketResponse.<Long>builder()
//                    .type(ResponseType.CHATROOM)
//                    .data(chatRoomId)
//                    .build();
//
//                JSONObject resJson = new JSONObject(res);
//
//                if(isChatRoomExist.get()) {
//                    return session.send(Mono.just(session.textMessage(resJson.toString())));
//                }
//
//                return this.getChatRoomList(username, session)
//                    .and(session.send(Mono.just(session.textMessage(resJson.toString()))));
//            });
//    }

    public Mono<Void> getChatMessages(
        JSONObject json,
        WebSocketSession session
    ) {
        long chatRoomId = json.getLong("chatRoomId");

        return chatMessageService.selectAllByRoomId(chatRoomId)
            .flatMap( list -> {
                WebSocketResponse<List<ChatMessageResponse.ChatMessage>> res = WebSocketResponse.<List<ChatMessageResponse.ChatMessage>>builder()
                    .type(ResponseType.CHAT_MESSAGE)
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
            "",
            null,
            Instant.now().toString()
        );

        Mono<Member> member = userService.findUserByUserId(username)
            .share();

        Mono<ChatRoomResultMap.ChatRoom> chatRoom = chatRoomService.selectById(websocketDTO.routeId())
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

        AtomicReference<List<SessionUser>> connectedUser = new AtomicReference<>();

        return chatRoom
            .flatMapMany( chatRoom1 -> {
                List<String> users = chatRoom1.getParticipants().stream()
                    .map(m -> m.getMember().getUserId())
                    .toList();

                List<SessionUser> user = sessionUserList.stream()
                    .filter( it -> users.contains(it.username()))
                    .toList();

                connectedUser.set(user);

                return Flux.fromIterable(connectedUser.get());
            })
            .flatMap(sessionUser ->
                chat.flatMap( chatMessage -> {
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
            )
            .then(Mono.defer(() ->
                chatRoomService.updateLastMessage(websocketDTO.routeId(), websocketDTO.content()))
                    .flatMapIterable( it -> connectedUser.get())
                    .flatMap( it -> this.getChatRoomList(it.username(), it.session()))
                    .then()
            );


    }
}
