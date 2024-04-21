package com.anamensis.batch.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/scheduler")
@RequiredArgsConstructor
public class SchedulerController {

    private final SchedulerFactoryBean schedulerFactoryBean;

    @GetMapping("stop")
    public Mono<String> stopScheduler() {

        schedulerFactoryBean.stop();

        return Mono.just("Scheduler stopped");
    }

    @GetMapping("start")
    public Mono<String> startScheduler() {
        schedulerFactoryBean.start();
        return Mono.just("Scheduler started");
    }

}
