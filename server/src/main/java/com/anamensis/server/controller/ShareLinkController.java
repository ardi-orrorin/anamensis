package com.anamensis.server.controller;

import com.anamensis.server.dto.request.ShareLinkRequest;
import com.anamensis.server.dto.response.ShareLinkResponse;
import com.anamensis.server.service.ShareLinkService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuples;

@RestController
@RequiredArgsConstructor
@RequestMapping("/link")
@Slf4j
public class ShareLinkController {

    private final ShareLinkService shareLinkService;

    private final UserService userService;

    @GetMapping("{shareLink}")
    public Mono<ShareLinkResponse.Redirect> redirect(@PathVariable String shareLink) {
        return Mono.just(shareLinkService.selectByShareLink(shareLink))
                .map(sl -> ShareLinkResponse.Redirect.of(sl.getOrgLink()));
    }

    @PostMapping("")
    public Mono<ShareLinkResponse.ShareLink> insert(
            @RequestBody Mono<ShareLinkRequest.Param> shareLink,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {

        return Mono.zip(shareLink, user)
                .publishOn(Schedulers.parallel())
                .map(tuple -> Tuples.of(
                        tuple.getT1(),
                        userService.findUserByUserId(tuple.getT2().getUsername())
                ))
                .map(tuple -> shareLinkService.insert(tuple.getT1().getLink(), tuple.getT2()))
                .publishOn(Schedulers.parallel())
                .map(ShareLinkResponse.ShareLink::transToShareLink);
    }

    @PutMapping("{shareLink}")
    public Mono<Boolean> updateUse(@PathVariable String shareLink,
                                   @RequestParam boolean isUse
    ) {
        return Mono.just(shareLinkService.updateUse(shareLink, isUse));
    }

}
