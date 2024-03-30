package com.anamensis.server.controller;

import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.service.ShareLinkService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

@RestController
@RequiredArgsConstructor
@RequestMapping("/link")
public class ShareLinkController {

    private final ShareLinkService shareLinkService;

    private final UserService userService;

    @GetMapping("{shareLink}")
    public Mono<String> redirect(@PathVariable String shareLink) {
        return Mono.just(shareLinkService.selectByShareLink(shareLink))
                .map(sl -> "redirect://" + sl.getOrgLink());
    }

    @PostMapping("")
    public Mono<String> insert(
            @RequestBody Mono<ShareLink> shareLink,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return Mono.zip(shareLink, user)
                .map(tuple -> Tuples.of(
                        tuple.getT1(),
                        userService.findUserByUserId(tuple.getT2().getUsername())
                ))
                .map(tuple -> shareLinkService.insert(tuple.getT1(), tuple.getT2()));
    }

    @PutMapping("{shareLink}")
    public Mono<Boolean> updateUse(@PathVariable String shareLink,
                                   @RequestParam boolean isUse
    ) {
        return Mono.just(shareLinkService.updateUse(shareLink, isUse));
    }

}
