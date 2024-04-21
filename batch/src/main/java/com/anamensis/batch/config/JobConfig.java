package com.anamensis.batch.config;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class JobConfig {

    @Bean
    public Job job1(JobRepository jobRepository, Step step1) {
        return new JobBuilder("job1", jobRepository)
                .start(step1)
                .incrementer(new RunIdIncrementer())
                .build();
    }


    @Bean
    public Step step1(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("step1", jobRepository)
                .tasklet((con, chunk) -> {
                    System.out.println("Hello World 11111111111111");
                    return RepeatStatus.FINISHED;
                },tm)
                .allowStartIfComplete(true)
                .build();
    }

    @Bean
    public Job job2(JobRepository jobRepository, Step step2) {
        return new JobBuilder("job2", jobRepository)
                .start(step2)
                .incrementer(new RunIdIncrementer())
                .build();
    }

    @Bean
    public Step step2(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("step2", jobRepository)
                .tasklet((con, chunk) -> {
                    System.out.println("Hello World 22222222222222222");
                    return RepeatStatus.FINISHED;
                },tm)
                .allowStartIfComplete(true)
                .build();
    }
}
