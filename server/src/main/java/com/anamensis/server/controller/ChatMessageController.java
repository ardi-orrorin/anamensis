package com.anamensis.server.controller;

import com.anamensis.server.dto.UserDto;
import com.anamensis.server.dto.response.ChatMessageResponse;
import com.anamensis.server.service.ChatMessageService;
import com.anamensis.server.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/chat-messages")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;

    @GetMapping("/chat-room/{id}")
    public Mono<List<ChatMessageResponse.ChatMessage>> selectAllByChatRoomId(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDto principal
    ) {
        return chatRoomService.validateChatRoomByUserId(id, principal.getUsername())
            .flatMap(existChatRoom -> {
                if(!existChatRoom) {
                    return Mono.error(new RuntimeException("채팅방이 존재하지 않습니다."));
                }

                return chatMessageService.selectAllByRoomId(id);
            });
    }
}
