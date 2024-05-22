package com.anamensis.batch.job.dummyfile;

import com.anamensis.batch.entity.File;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

@Component
@RequiredArgsConstructor
@Slf4j
public class DummyFileJob {

    private final JobRepository jobRepository;

    private final PlatformTransactionManager tm;

    private final DummyFileService dummyFileService;

    @Bean
    public Job dummyFileDeleteJob() {
        return new JobBuilder("dummy-file-delete-job", jobRepository)
                .start(dummyFileDeleteStep(jobRepository, tm))
                .incrementer(new RunIdIncrementer())
                .build();
    }


    private Step dummyFileDeleteStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("dummy-file-delete-step", jobRepository)
                .<File, File>chunk(200, tm)
                .reader(dummyFileService.dummyFileDeleteReader())
                .processor(dummyFileService::dummyFileDelete)
                .writer(dummyFileService::dummyFileDeleteWriter)
                .allowStartIfComplete(true)
                .build();
    }
}
