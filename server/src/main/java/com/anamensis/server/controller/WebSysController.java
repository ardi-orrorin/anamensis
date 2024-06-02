package com.anamensis.server.controller;

import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.request.WebSysRequest;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.WebSys;
import com.anamensis.server.service.WebSysService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("admin/api/web-sys")
public class WebSysController {

    private final WebSysService webSysService;

    @GetMapping("")
    public Mono<List<WebSys>> findAll() {
        return webSysService.findAll();
    }

    @GetMapping("/code")
    public Mono<WebSys> findByCode(@RequestParam String code) {
        return webSysService.findByCode(code);
    }

    @PostMapping("")
    public Mono<Void> save(@RequestBody WebSysRequest.WebSysReq webSys) {
        return webSysService.save(webSys.toEntity());
    }

    @PostMapping("list")
    public Mono<Void> saveAll(@RequestBody WebSysRequest.WebSysList req) {
        return webSysService.saveAll(req.getList());
    }

    @PutMapping("")
    public Mono<StatusResponse> update(@RequestBody WebSys webSys) {
        return webSysService.update(webSys)
                .map(result -> {
                    StatusType status = result ? StatusType.SUCCESS : StatusType.FAIL;
                    String message = result ? "Success" : "Fail";
                    return StatusResponse.builder()
                            .status(status)
                            .message(message)
                            .build();
                });
    }

    @DeleteMapping("/code/{code}")
    public Mono<StatusResponse> deleteByCode(@PathVariable String code) {

        return webSysService.deleteByCode(code)
                .map(result -> {
                    StatusType status = result ? StatusType.SUCCESS : StatusType.FAIL;
                    String message = result ? "Success" : "Fail";
                    return StatusResponse.builder()
                            .status(status)
                            .message(message)
                            .build();
                });
    }
}
