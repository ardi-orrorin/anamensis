package com.anamensis.server.controller;

import com.anamensis.server.dto.request.SystemSettingRequest;
import com.anamensis.server.dto.response.SystemSettingResponse;
import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import com.anamensis.server.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/master/api/system-settings")
@Slf4j
public class SystemSettingController {

    private final SystemSettingService systemSettingService;


    @PublicAPI
    @GetMapping("")
    public Mono<Map<String, Object>> publicFindAll() {
        return systemSettingService.findAll(true)
            .map(SystemSettingResponse::toList);
    }

    @PublicAPI
    @GetMapping("oauth")
    public Mono<Map<String, Object>> publicFindAllOauth() {
        return systemSettingService.findByKey(SystemSettingKey.OAUTH)
            .map(SystemSettingResponse::toItem);
    }

    @GetMapping("")
    public Mono<Map<String, Object>> findAll() {
        return systemSettingService.findAll(false)
            .map(SystemSettingResponse::toList);
    }

    @GetMapping("/init")
    public Mono<Boolean> initSystemSetting(
        @RequestParam String key
    ) {
        return systemSettingService.initSystemSetting(SystemSettingKey.valueOf(key.toUpperCase()));
    }

    @PutMapping("")
    public Mono<SystemSetting> saveSystemSetting(
        @RequestBody SystemSettingRequest.Update request
    ) {
        return systemSettingService.save(request.getKey(), request.getValue());
    }

}
