package com.anamensis.server.controller;

import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.request.BoardTemplateRequest;
import com.anamensis.server.dto.response.BoardTemplateResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.service.BoardTemplateService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("api/board-template")
@RequiredArgsConstructor
public class BoardTemplateController {

    private final BoardTemplateService bts;
    private final UserService us;

    @GetMapping("")
    public Mono<List<BoardTemplateResponse.List>> findAll(
        @AuthenticationPrincipal UserDetails user
    ) {
        return us.findUserByUserId(user.getUsername())
            .flatMapMany(u -> bts.findAll(u.getId()))
            .collectList();
    }

    @GetMapping("{id}")
    public Mono<BoardTemplateResponse.Detail> findById(
        @PathVariable long id,
        @AuthenticationPrincipal UserDetails user
    ) {
        return us.findUserByUserId(user.getUsername())
            .flatMap(u -> bts.findById(id))
            .map(BoardTemplateResponse.Detail::from);
    }

    @PostMapping("")
    public Mono<StatusResponse> save(
        @RequestBody BoardTemplateRequest.Save body,
        @AuthenticationPrincipal UserDetails user
    ) {
        return us.findUserByUserId(user.getUsername())
            .flatMap(u -> bts.save(BoardTemplateRequest.Save.toEntity(body, u.getId())))
            .flatMap(b -> Mono.just(
                StatusResponse.builder()
                    .status(b ? StatusType.SUCCESS : StatusType.FAIL)
                    .message(b ? "탬플릿 저장했습니다" : "텔플릿을 저장할 수 없습니다.")
                    .build())
            );
    }

    @PutMapping("/{id}")
    public Mono<StatusResponse> update(
        @PathVariable long id,
        @RequestBody BoardTemplateRequest.Save body,
        @AuthenticationPrincipal UserDetails user
    ) {
        body.setId(id);
        return us.findUserByUserId(user.getUsername())
            .flatMap(u -> bts.update(BoardTemplateRequest.Save.toEntity(body, u.getId())))
            .flatMap(b -> Mono.just(
                StatusResponse.builder()
                    .status(b ? StatusType.SUCCESS : StatusType.FAIL)
                    .message(b ? "탬플릿 업데이트 했습니다." : "텔플릿을 업데이트할 수 없습니다.")
                    .build())
            );
    }

    @PutMapping("disable")
    public Mono<StatusResponse> disable(
        @RequestBody BoardTemplateRequest.DisableIds body,
        @AuthenticationPrincipal UserDetails user
    ) {
        return us.findUserByUserId(user.getUsername())
            .flatMap(u -> bts.disable(body.getIds(), u.getId()))
            .flatMap(b -> Mono.just(
                StatusResponse.builder()
                    .status(b ? StatusType.SUCCESS : StatusType.FAIL)
                    .message(b ? "탬플릿 삭제 했습니다." : "텔플릿을 삭제 수 없습니다.")
                    .build())
            );
    }
}
