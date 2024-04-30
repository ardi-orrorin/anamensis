package com.anamensis.server.controller;

import com.anamensis.server.entity.PointCode;
import com.anamensis.server.service.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("api/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    @GetMapping("")
    public Mono<List<PointCode>> selectAll() {
        return pointService.selectAll();
    }

    @GetMapping("/search")
    public Mono<List<PointCode>> selectByIdOrName(Mono<PointCode> pointCode) {
        return pointCode.flatMap(pointService::selectByIdOrName);
    }

    @PostMapping("")
    public Mono<Boolean> insert(@RequestBody Mono<PointCode> pointCode) {
        return pointCode.map(pointService::insert);
    }
}
