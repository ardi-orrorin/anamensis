package com.anamensis.server.service;

import com.anamensis.server.dto.request.ChatRoomRequest;
import com.anamensis.server.dto.response.ChatRoomResponse;
import com.anamensis.server.entity.ChatMessage;
import com.anamensis.server.entity.ChatRoom;
import com.anamensis.server.entity.Member;
import com.anamensis.server.mapper.ChatRoomMapper;
import com.anamensis.server.mapper.MemberMapper;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomService {

    private final MemberMapper memberMapper;
    private final ChatRoomMapper chatRoomMapper;

    public Mono<List<ChatRoomResponse.ListItem>> selectAllByUsername(String username) {
        return Flux.fromIterable(chatRoomMapper.selectAll(username))
            .flatMap(chatRoom->
                Mono.just(ChatRoomResponse.ListItem.fromListItem(chatRoom))
            )
            .collectList();
        }

    public Mono<Optional<ChatRoomResultMap.ChatRoom>> selectById(Long id) {
        return Mono.fromCallable(() -> chatRoomMapper.selectById(id));
    }

    public Mono<Long> hasChatRoomWithBothUsers(String firstUserId, String secondUserId) {
        return Mono.fromCallable(() ->
            chatRoomMapper.chatRoomIdByUsers(firstUserId, secondUserId)
                .stream().filter(chatRoom -> chatRoom.getUserCount() == 2)
                .findFirst()
                .map(ChatRoomResultMap.ChatRomeUserCount::getId)
                .orElse(0L)
        );
    }

    public Mono<ChatRoomResultMap.ChatRoom> save(ChatRoomRequest.Create request, String username) {
        return Mono.fromCallable(()-> {
                List<Long> participants = memberMapper.findMemberByUserIds(request.inviteUser())
                    .stream().map(Member::getId).toList();
                Member host = memberMapper.findMemberByUserId(username).orElseThrow(()->
                    new RuntimeException("User not found")
                );

                ChatRoom chatRoom = new ChatRoom(
                    0L,
                    request.name(),
                    request.chatType(),
                    host.getId(),
                    "새로운 대화를 시작합니다.",
                    Instant.now(),
                    Instant.now()
                );

                chatRoomMapper.save(chatRoom);

                chatRoomMapper.saveChatRoomUser(chatRoom.getId(), participants);

                return chatRoom;
            })
            .flatMap(chatRoom -> Mono.justOrEmpty(chatRoomMapper.selectById(chatRoom.getId())))
            .switchIfEmpty(Mono.error(new RuntimeException("ChatRoom not found")));
    }

}
