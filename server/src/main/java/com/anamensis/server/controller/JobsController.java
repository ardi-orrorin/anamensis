package com.anamensis.server.controller;

import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.service.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.batch.core.*;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.batch.BatchProperties;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;

@RestController
@RequestMapping("/master/api/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobsController {

    private final JobService jobService;

    @GetMapping("")
    public Mono<StatusResponse> resetBoardIndex(
        @RequestParam String jobName
    ) {
        return jobService.startJob(jobName)
            .flatMap(aBoolean -> {
                StatusResponse statusResponse = StatusResponse.builder()
                    .status(aBoolean ? StatusType.SUCCESS : StatusType.FAIL)
                    .message(jobName + " job completed")
                    .build();

                return Mono.just(statusResponse);
            });
    }

    @GetMapping("/status")
    public Mono<StatusResponse> jobStatus(
        @RequestParam String jobName
    ) {
        return jobService.jobStatus(jobName)
            .flatMap(jobStatus -> {
                StatusResponse statusResponse = StatusResponse.builder()
                    .status(StatusType.SUCCESS)
                    .message(jobStatus.toString())
                    .timestamp(LocalDateTime.now())
                    .build();

                return Mono.just(statusResponse);
            });
    }

//    @GetMapping("test")
//    public Mono<String> testScheduler(@RequestParam(defaultValue = "") String ids) throws Exception {
//
//        JobParameters jobParameters = new JobParametersBuilder()
//                .addString("ids", ids)
//                .addLocalDateTime("date", java.time.LocalDateTime.now())
//                .toJobParameters();
//
//        Job job = jobRegistry.getJob("email-send-job");
//
//        jobLauncher.run(job, jobParameters);
//
//        return Mono.just("Scheduler is working");
//    }

    @GetMapping("start")
    public Mono<StatusResponse> startTrigger(@RequestParam(defaultValue = "all") String job) throws SchedulerException {

        return jobService.startTrigger(job)
            .flatMap(aBoolean -> {
                StatusResponse statusResponse = StatusResponse.builder()
                    .status(aBoolean ? StatusType.SUCCESS : StatusType.FAIL)
                    .message("Scheduler started")
                    .build();

                return Mono.just(statusResponse);
            });
    }

    @GetMapping("stop")
    public Mono<StatusResponse> stopTrigger(@RequestParam(defaultValue = "all") String job) throws SchedulerException {

        return jobService.stopTrigger(job)
            .flatMap(aBoolean -> {
                StatusResponse statusResponse = StatusResponse.builder()
                    .status(aBoolean ? StatusType.SUCCESS : StatusType.FAIL)
                    .message("Scheduler stopped")
                    .build();

                return Mono.just(statusResponse);
            });
    }


}
