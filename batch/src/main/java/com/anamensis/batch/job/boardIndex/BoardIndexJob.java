package com.anamensis.batch.job.boardIndex;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.quartz.JobExecutionContext;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class BoardIndexJob extends QuartzJobBean {
    private final JobExplorer jobExplorer;

    private final JobLauncher jobLauncher;

    private final JobRepository jobRepository;

    private final PlatformTransactionManager tm;

    private final BoardIndexStep boardIndexStep;

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext context) {
        Job job = new JobBuilder("board-index-job", jobRepository)
            .start(boardIndexStep.boardIndexStep(jobRepository, tm))
            .incrementer(new RunIdIncrementer())
            .preventRestart()
            .build();

        JobParameters jobParameters = new JobParametersBuilder(this.jobExplorer)
            .getNextJobParameters(job)
            .toJobParameters();

        this.jobLauncher.run(job, jobParameters);
    }
}
