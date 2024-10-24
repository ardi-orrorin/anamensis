package com.anamensis.server.batch.job.dummyfile;

import com.anamensis.server.config.BeanConfig;
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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class DummyFileJob extends QuartzJobBean {

    private final JobExplorer jobExplorer;

    private final JobLauncher jobLauncher;

    private final JobRepository jobRepository;

    private final PlatformTransactionManager tm;

    private final DummyFileStep dummyFileStep;
    private final BeanConfig beanConfig;

    @Bean("dummy-file-delete-job")
    public Job dummyFileJob() {
        return new JobBuilder("dummy-file-delete-job", jobRepository)
                .start(dummyFileStep.step(10, "dummy-file-delete", jobRepository, tm))
                .incrementer(new RunIdIncrementer())
                .build();
    }


    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext context) {

        Job dummyFileJob = this.dummyFileJob();

        JobParameters jobParameters = new JobParametersBuilder(this.jobExplorer)
                .addLong("time", System.currentTimeMillis())
                .getNextJobParameters(dummyFileJob)
                .toJobParameters();

        this.jobLauncher.run(dummyFileJob, jobParameters);
    }
}
