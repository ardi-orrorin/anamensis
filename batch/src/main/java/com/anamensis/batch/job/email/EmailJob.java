package com.anamensis.batch.job.email;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class EmailJob extends QuartzJobBean {

    @Autowired
    private JobExplorer jobExplorer;

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PlatformTransactionManager tm;

    @Autowired
    private EmailStep emailStep;

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext context) {
        Job job = new JobBuilder("email-send-job", jobRepository)
                .start(emailStep.emailSendStep(jobRepository, tm))
                .incrementer(new RunIdIncrementer())
                .build();;

        JobParameters jobParameters = new JobParametersBuilder(this.jobExplorer)
                    .getNextJobParameters(job)
                    .toJobParameters();

        this.jobLauncher.run(job, jobParameters);
    }
}
