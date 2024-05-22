package com.anamensis.batch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.NoSuchJobException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/scheduler")
@RequiredArgsConstructor
@Slf4j
public class SchedulerController {

    private final SchedulerFactoryBean schedulerFactoryBean;

    private final JobLauncher jobLauncher;

    private final JobRegistry jobRegistry;

    @GetMapping("test")
    public Mono<String> testScheduler(@RequestParam(defaultValue = "") String ids) throws Exception {

        JobParameters jobParameters = new JobParametersBuilder()
                .addString("ids", ids)
                .addLocalDateTime("date", java.time.LocalDateTime.now())
                .toJobParameters();

        Job job = jobRegistry.getJob("email-send-job");

        jobLauncher.run(job, jobParameters);

        return Mono.just("Scheduler is working");
    }

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
