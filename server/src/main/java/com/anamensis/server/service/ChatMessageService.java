package com.anamensis.server.service;

import com.anamensis.server.dto.response.ChatMessageResponse;
import com.anamensis.server.dto.response.ChatRoomResponse;
import com.anamensis.server.entity.ChatMessage;
import com.anamensis.server.mapper.ChatMessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageMapper chatMessageMapper;

    public Mono<List<ChatMessageResponse.ChatMessage>> selectAllByRoomId(long roomId) {
        return Flux.fromIterable(chatMessageMapper.findAllByChatRoomId(roomId, Instant.now().minus(3, ChronoUnit.DAYS)))
            .flatMap(chatMessage ->
                Mono.just(new ChatMessageResponse().from(chatMessage))
            )
            .collectList();
    }

    public Mono<ChatMessage> save(ChatMessage chatMessage) {
        return Mono.fromCallable(()-> {
            chatMessageMapper.save(chatMessage);
            return chatMessage;
        });
    }

}
