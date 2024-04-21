package com.anamensis.batch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Set;

@RestController
@RequestMapping("/scheduler")
@RequiredArgsConstructor
@Slf4j
public class SchedulerController {

    private final SchedulerFactoryBean schedulerFactoryBean;


    @GetMapping("stop")
    public Mono<String> stopScheduler(@RequestParam(defaultValue = "all") String job) throws SchedulerException {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();

        if("all".equals(job)){
            Set<TriggerKey> triggerKeys = scheduler.getTriggerKeys(GroupMatcher.anyGroup());
            for (TriggerKey triggerKey : triggerKeys) {
                scheduler.pauseTrigger(triggerKey);
            }
            return Mono.just("Scheduler stopped");
        }

        try {
            TriggerKey key = TriggerKey.triggerKey(job, "DEFAULT");
            scheduler.pauseTrigger(key);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Mono.just("Scheduler stopped");
    }

    @GetMapping("start")
    public Mono<String> startScheduler(@RequestParam(defaultValue = "all") String job) throws SchedulerException {

        Scheduler scheduler = schedulerFactoryBean.getScheduler();

        if("all".equals(job)){
            Set<TriggerKey> triggerKeys = scheduler.getTriggerKeys(GroupMatcher.anyGroup());

            for (TriggerKey triggerKey : triggerKeys) {
                scheduler.resumeTrigger(triggerKey);
            }
            return Mono.just("Scheduler started");
        }


        try {
            TriggerKey key = TriggerKey.triggerKey(job, "DEFAULT");
            scheduler.resumeTrigger(key);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Mono.just("Scheduler started");
    }

}
