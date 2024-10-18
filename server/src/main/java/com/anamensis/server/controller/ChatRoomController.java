package com.anamensis.server.controller;

import com.anamensis.server.dto.RoomType;
import com.anamensis.server.dto.request.ChatRoomRequest;
import com.anamensis.server.dto.response.ChatRoomResponse;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import com.anamensis.server.service.ChatRoomService;
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
            .flatMap(chatRoom-> Mono.just(new ChatRoomResponse().fromDetail(chatRoom)));
    }

    @GetMapping("/partner/{partner}")
    public Mono<ChatRoomResponse.ListItem> selectByPartner(
        @PathVariable String partner,
        @AuthenticationPrincipal UserDetails principal
    ) {
        return chatRoomService.hasChatRoomWithBothUsers(principal.getUsername(), partner)
            .flatMap(chatRoomId -> {
                if (chatRoomId != 0) {
                    return chatRoomService.selectById(chatRoomId)
                        .flatMap(chatRoom -> Mono.just(ChatRoomResponse.ListItem.fromListItem(chatRoom)));
                }

                ChatRoomRequest.Create request = new ChatRoomRequest.Create(
                    "대화방",
                    principal.getUsername(),
                    List.of(principal.getUsername(), partner),
                    RoomType.PRIVATE
                );

                return chatRoomService.save(request, principal.getUsername())
                    .flatMap(chatRoomResultMap -> Mono.just(ChatRoomResponse.ListItem.fromListItem(chatRoomResultMap)));
            });
    }

    @PostMapping("")
    public Mono<ChatRoomResponse.Detail> save(
        @RequestBody ChatRoomRequest.Create request,
        @AuthenticationPrincipal UserDetails principal
    ) {
        return chatRoomService.save(request, principal.getUsername())
            .flatMap(chatRoomResultMap ->
                Mono.just(new ChatRoomResponse().fromDetail(chatRoomResultMap))
            );
    }


}
