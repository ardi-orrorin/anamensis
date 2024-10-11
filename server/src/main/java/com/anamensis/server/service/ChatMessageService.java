package com.anamensis.server.service;

import com.anamensis.server.entity.ChatMessage;
import com.anamensis.server.mapper.ChatMessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageMapper chatMessageMapper;

    public Mono<ChatMessage> save(ChatMessage chatMessage) {
        return Mono.fromCallable(()-> {
            chatMessageMapper.save(chatMessage);
            return chatMessage;
        });
    }

}
