package com.anamensis.server.controller;

import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.request.PointCodeRequest;
import com.anamensis.server.dto.response.PointCodeResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.PointCode;
import com.anamensis.server.service.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("master/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    @GetMapping("")
    public Mono<List<PointCodeResponse.ListItem>> selectAll() {
        return pointService.selectAll();
    }

    @PutMapping("")
    public Mono<StatusResponse> update(@RequestBody PointCodeRequest.UpdateList pointCodeList) {
        return pointService.update(pointCodeList.getList())
            .flatMap(result -> {
                StatusResponse statusResponse = StatusResponse.builder()
                    .status(result ? StatusType.SUCCESS : StatusType.FAIL)
                    .message("Updated Successfully")
                    .build();

                return Mono.just(statusResponse);
            });
    }

    @PutMapping("reset")
    public Mono<StatusResponse> init(
        @RequestBody PointCodeRequest.Reset reset
    ) {
        return Mono.defer(()->
                reset.isAll()
                ? pointService.reset()
                : pointService.resetById(reset.getIds())
        )
        .flatMap(result -> {
            StatusResponse statusResponse = StatusResponse.builder()
                .status(result ? StatusType.SUCCESS : StatusType.FAIL)
                .message("Reset Successfully")
                .build();

            return Mono.just(statusResponse);
        });
    }

    @PostMapping("")
    public Mono<Boolean> insert(@RequestBody PointCode pointCode) {
        return pointService.insert(pointCode);
    }


}
