package com.anamensis.server.websocket.Receiver;

import com.anamensis.server.entity.ChatMessage;
import com.anamensis.server.entity.Member;
import com.anamensis.server.service.UserService;
import com.anamensis.server.websocket.dto.SessionUser;
import com.anamensis.server.websocket.dto.WebsocketDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
public class ChatReceiver {

    private final UserService userService;

    public Mono<Void> receiver(
        String username,
        WebsocketDTO websocketDTO,
        List<SessionUser> sessionUserList
    ) {

        AtomicInteger chatRoomId = new AtomicInteger(0);

        Mono<Member> member = userService.findUserByUserId(username)
            .subscribeOn(Schedulers.boundedElastic());




        return Mono.empty()

            .then();

    }
}
