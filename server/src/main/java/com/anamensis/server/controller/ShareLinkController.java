package com.anamensis.server.controller;

import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.request.ShareLinkRequest;
import com.anamensis.server.dto.response.ShareLinkResponse;
import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.service.ShareLinkService;
import com.anamensis.server.service.UserService;
import jakarta.validation.Valid;
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
@RequestMapping("api/link")
@Slf4j
public class ShareLinkController {

    private final ShareLinkService shareLinkService;

    private final UserService userService;

    @GetMapping("{shareLink}")
    public Mono<ShareLinkResponse.Redirect> redirect(@PathVariable String shareLink) {
        return Mono.just(shareLinkService.selectByShareLink(shareLink))
                .map(sl -> ShareLinkResponse.Redirect.of(sl.getOrgLink()));
    }

    @GetMapping("")
    public Mono<PageResponse<ShareLink>> list(
            Page page,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {

        return user.map(userDetails -> userService.findUserByUserId(userDetails.getUsername()))
                   .zipWith(Mono.just(page))
                   .map(shareLinkService::selectAll)
                   .map(t -> PageResponse.<ShareLink>builder()
                           .content(t.getT1())
                           .page(t.getT2())
                           .build()
                   );
    }

    @PostMapping("")
    public Mono<ShareLinkResponse.ShareLink> insert(
            @RequestBody @Valid Mono<ShareLinkRequest.Param> shareLink,
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

    @PutMapping("")
    public Mono<ShareLinkResponse.Use> updateUse(
            @RequestBody Mono<ShareLinkRequest.Use> shareLink,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return shareLink.zipWith(user)
                .publishOn(Schedulers.parallel())
                .map(tuple ->
                        tuple.mapT2(u ->
                            userService.findUserByUserId(u.getUsername())
                ))
                .map(shareLinkService::updateUse)
                .publishOn(Schedulers.parallel())
                .map(ShareLinkResponse.Use::of);
    }

}
