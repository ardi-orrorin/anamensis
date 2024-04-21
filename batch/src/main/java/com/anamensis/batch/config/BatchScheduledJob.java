package com.anamensis.batch.config;

import lombok.SneakyThrows;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.NoSuchJobException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.QuartzJobBean;

@Configuration
public class BatchScheduledJob extends QuartzJobBean {

    @Autowired
    private JobExplorer jobExplorer;

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private JobRegistry jobRegistry;

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {


        Job job = null;
        try {
            job = jobRegistry.getJob("mail-test-job");
        } catch (NoSuchJobException e) {
            throw new RuntimeException(e);
        }


        JobParameters jobParameters = new JobParametersBuilder(this.jobExplorer)
                    .getNextJobParameters(job)
                    .toJobParameters();

        this.jobLauncher.run(job, jobParameters);

    }
}
