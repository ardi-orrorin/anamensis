package com.anamensis.server.controller;

import com.anamensis.server.dto.request.PointCodeRequest;
import com.anamensis.server.dto.response.PointCodeResponse;
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
    public Mono<Boolean> update(@RequestBody PointCodeRequest.UpdateList pointCodeList) {
        return pointService.update(pointCodeList.getList());
    }

//    @GetMapping("/search")
//    public Mono<List<PointCode>> selectByIdOrName(Mono<PointCode> pointCode) {
//        return pointCode.flatMap(pointService::selectByIdOrName);
//    }

    @PostMapping("")
    public Mono<Boolean> insert(@RequestBody PointCode pointCode) {
        return pointService.insert(pointCode);
    }
}
