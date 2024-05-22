package com.anamensis.batch.job.email;

import com.anamensis.batch.entity.UserConfigSmtp;
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
@Slf4j
@RequiredArgsConstructor
public class EmailJob {

    private final JobRepository jobRepository;

    private final PlatformTransactionManager tm;

    private final EmailService emailService;

    private final MailItemWriter mailItemWriter;

    @Bean
    public Job emailSendJob(){
        return new JobBuilder("email-send-job", jobRepository)
                .start(emailSendStep(jobRepository, tm))
                .incrementer(new RunIdIncrementer())
                .build();
    }

    private Step emailSendStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("email-send-step", jobRepository)
                .<UserConfigSmtp, UserConfigSmtp>chunk(2, tm)
                .reader(emailService.myBatisCursorItemReader(null))
                .writer(mailItemWriter)
                .allowStartIfComplete(true)
                .build();
    }
}
