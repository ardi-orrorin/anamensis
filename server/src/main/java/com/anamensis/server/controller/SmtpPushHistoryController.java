package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.response.SmtpPushHistoryResponse;
import com.anamensis.server.resultMap.MemberResultMap;
import com.anamensis.server.service.SmtpPushHistoryService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.concurrent.atomic.AtomicReference;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/smtp-push-history")
@Slf4j
public class SmtpPushHistoryController {

    private final UserService userService;
    private final SmtpPushHistoryService smtpPushHistoryService;

    @GetMapping("")
    public Mono<PageResponse<SmtpPushHistoryResponse.ListSmtpPushHistory>> findByUserPk (
            @AuthenticationPrincipal UserDetails userDetails,
            Page page
        ) {

        AtomicReference<MemberResultMap> memberResultMapAtomic = new AtomicReference<>();

        return userService.findUserInfo(userDetails.getUsername())
                .doOnNext(memberResultMapAtomic::set)
                .flatMap(user -> smtpPushHistoryService.countByMemberPk(user.getMemberPk()))
                .flatMapMany(count -> {
                    page.setTotal(count.intValue());
                    return smtpPushHistoryService.findByMemberPk(memberResultMapAtomic.get().getMemberPk(), page);
                })
                .collectList()
                .map(content ->
                    PageResponse.<SmtpPushHistoryResponse.ListSmtpPushHistory>builder()
                        .page(page)
                        .content(content)
                        .build()
                );
    }


}
