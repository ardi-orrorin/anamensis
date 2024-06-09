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
import reactor.core.scheduler.Schedulers;

import java.util.List;

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

        Mono<MemberResultMap> memberResult = userService.findUserInfo(userDetails.getUsername())
                .subscribeOn(Schedulers.boundedElastic())
                .share();

        Mono<Long> count = memberResult
                .flatMap(user -> smtpPushHistoryService.countByMemberPk(user.getMemberPk()))
                .subscribeOn(Schedulers.boundedElastic());

        Mono<List<SmtpPushHistoryResponse.ListSmtpPushHistory>> content = memberResult
                .flatMapMany(user -> smtpPushHistoryService.findByMemberPk(user.getMemberPk(), page))
                .subscribeOn(Schedulers.boundedElastic())
                .collectList();

        return Mono.zip(content, count)
                .map(t -> {
                    page.setTotal(t.getT2().intValue());
                    return new PageResponse<>(page, t.getT1());
                });
    }


}
