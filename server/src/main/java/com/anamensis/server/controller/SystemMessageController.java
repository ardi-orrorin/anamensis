package com.anamensis.server.controller;

import com.anamensis.server.dto.request.SystemMessageRequest;
import com.anamensis.server.entity.SystemMessage;
import com.anamensis.server.service.SystemMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/api/sys-message")
public class SystemMessageController {
    private final SystemMessageService systemMessageService;

    @GetMapping("/web-sys/{webSysPk}")
    public Mono<List<SystemMessage>> findByWebSysPk(@PathVariable String webSysPk) {
        return systemMessageService.findByWebSysPk(webSysPk);
    }

    @GetMapping("")
    public Mono<SystemMessage> findById(@RequestParam int id) {
        return systemMessageService.findById(id);
    }

    @PostMapping("")
    public Mono<Boolean> save(@Valid @RequestBody SystemMessageRequest.Body sm) {
        return systemMessageService.save(sm.toEntity());
    }

    @PutMapping("")
    public Mono<Boolean> update(@Valid @RequestBody SystemMessageRequest.Body sm) {
        return systemMessageService.update(sm.toEntity());
    }

    @PutMapping("/is-use")
    public Mono<Boolean> updateIsUse(@RequestBody SystemMessageRequest.isUse isUse) {
        return systemMessageService.updateIsUse(isUse.getId(), isUse.isUse());
    }

    @DeleteMapping("")
    public Mono<Boolean> delete(@RequestParam int id) {
        return systemMessageService.delete(id);
    }

}
