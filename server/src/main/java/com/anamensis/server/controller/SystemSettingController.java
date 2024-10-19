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
@RequestMapping("/master/system-settings")
@Slf4j
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @GetMapping("")
    public Mono<Map<String, Object>> findAll() {
        return systemSettingService.findAll()
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
        return systemSettingService.saveSystemSetting(request.getKey(), request.getValue());
    }

}
