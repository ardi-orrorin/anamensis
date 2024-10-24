package com.anamensis.server.service;

import com.anamensis.server.entity.JobExecution;
import com.anamensis.server.entity.JobStatus;
import com.anamensis.server.repository.JobExecutionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerKey;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final SchedulerFactoryBean schedulerFactoryBean;

    private final JobLauncher jobLauncher;

    private final JobRegistry jobRegistry;

    private final JobExecutionRepository jobExecutionRepository;

    public Mono<JobStatus> jobStatus(String jobName) {
        JobExecution jobExecutionEntity = jobExecutionRepository.findById(jobName).orElseThrow(() ->
            new RuntimeException("Job not found"));

        if(jobExecutionEntity.getStatus() == JobStatus.PROCESSING){
            return Mono.just(JobStatus.PROCESSING);
        }

        jobExecutionEntity.setStatus(JobStatus.READY);
        jobExecutionRepository.save(jobExecutionEntity);
        return Mono.just(jobExecutionEntity.getStatus());
    }

    public Mono<Boolean> startJob(String jobName) {
        JobExecution jobExecutionEntity = jobExecutionRepository.findById(jobName).orElseThrow(() ->
            new RuntimeException("Job not found"));


        try {
            Job job = jobRegistry.getJob(jobName);
            jobExecutionEntity.setStatus(JobStatus.PROCESSING);
            jobExecutionRepository.flush();
            jobLauncher.run(job, new JobParameters());

        } catch (Exception e) {
            jobExecutionEntity.setStatus(JobStatus.FAILED);
            jobExecutionRepository.flush();
            log.error(e.getMessage());

            return Mono.error(e);
        }

        jobExecutionEntity.setStatus(JobStatus.COMPLETED);
        jobExecutionRepository.save(jobExecutionEntity);
        return Mono.just(true);
    }

    public Mono<Boolean> startTrigger(String job) throws SchedulerException {

        Scheduler scheduler = schedulerFactoryBean.getScheduler();

        if("all".equals(job)){
            Set<TriggerKey> triggerKeys = null;
            triggerKeys = scheduler.getTriggerKeys(GroupMatcher.anyGroup());

            for (TriggerKey triggerKey : triggerKeys) {
                scheduler.resumeTrigger(triggerKey);
            }

            return Mono.just(true);
        }


        try {
            TriggerKey key = TriggerKey.triggerKey(job, "DEFAULT");
            scheduler.resumeTrigger(key);
        } catch (Exception e) {
            Mono.error(e);
        }

        return Mono.just(true);
    }

    public Mono<Boolean> stopTrigger(String job) throws SchedulerException {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();

        if("all".equals(job)){
            Set<TriggerKey> triggerKeys = scheduler.getTriggerKeys(GroupMatcher.anyGroup());
            for (TriggerKey triggerKey : triggerKeys) {
                scheduler.pauseTrigger(triggerKey);
            }
            return Mono.just(true);
        }

        try {
            TriggerKey key = TriggerKey.triggerKey(job, "DEFAULT");
            scheduler.pauseTrigger(key);
        } catch (Exception e) {
            Mono.error(e);
        }

        return Mono.just(true);
    }

}
