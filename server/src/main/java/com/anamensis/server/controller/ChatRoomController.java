package com.anamensis.server.controller;

import com.anamensis.server.config.AuthConverter;
import com.anamensis.server.dto.request.ChatRoomRequest;
import com.anamensis.server.dto.response.ChatRoomResponse;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import com.anamensis.server.service.ChatRoomService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("api/chat-rooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;


    @GetMapping("")
    public Mono<List<ChatRoomResponse.ListItem>> selectAllByUsername(
        @AuthenticationPrincipal UserDetails principal
    ) {
        return chatRoomService.selectAllByUsername(principal.getUsername());
    }

    @GetMapping("{id}")
    public Mono<ChatRoomResponse.Detail> selectById(@PathVariable Long id) {
        return chatRoomService.selectById(id)
            .flatMap(chatRoom-> {
                ChatRoomResultMap.ChatRoom resultMap = chatRoom.orElseThrow(()->
                    new RuntimeException("ChatRoom not found")
                );
                return Mono.just(new ChatRoomResponse().fromDetail(resultMap));
            });
    }

    @PostMapping("")
    public Mono<ChatRoomResponse.Detail> save(
        @RequestBody ChatRoomRequest.Create request,
        @AuthenticationPrincipal UserDetails principal
    ) {
        return chatRoomService.save(request, principal.getUsername())
            .flatMap(chatRoomResultMap -> {
                if(chatRoomResultMap.isEmpty()) {
                    return Mono.error(new RuntimeException("ChatRoom not found"));
                }
                return Mono.just(new ChatRoomResponse().fromDetail(chatRoomResultMap.get()));
            });
    }


}
