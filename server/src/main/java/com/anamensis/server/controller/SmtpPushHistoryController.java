package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.response.SmtpPushHistoryResponse;
import com.anamensis.server.service.SmtpPushHistoryService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/smtp-push-history")
public class SmtpPushHistoryController {

    private final UserService userService;
    private final SmtpPushHistoryService smtpPushHistoryService;

    @GetMapping("")
    public Mono<PageResponse<SmtpPushHistoryResponse.ListSmtpPushHistory>> findByUserPk (
            @AuthenticationPrincipal Mono<UserDetails> userDetails,
            Page page
            ) {

        return userDetails
                .flatMap(user -> userService.findUserInfo(user.getUsername()))
                .flatMap(user ->
                    Mono.zip(smtpPushHistoryService.countByUserPk(user.getUserPk()),
                             smtpPushHistoryService.findByUserPk(user.getUserPk(), page).collectList()
                    )
                ).map(t -> {
                    page.setTotal(t.getT1().intValue());
                    return PageResponse.<SmtpPushHistoryResponse.ListSmtpPushHistory>builder()
                            .page(page)
                            .content(t.getT2())
                            .build();
                });
    }


}
