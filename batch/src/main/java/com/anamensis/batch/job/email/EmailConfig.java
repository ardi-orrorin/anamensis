package com.anamensis.batch.job.email;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailConfig {

    @Bean
    public Trigger emailJobTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule();

        return TriggerBuilder.newTrigger()
                .forJob(emailJobDetail())
                .withIdentity("email-send-job-trigger")
                .withSchedule(scheduleBuilder)
                .build();
    }

    @Bean
    public JobDetail emailJobDetail() {
        return JobBuilder.newJob(EmailJob.class)
                .withIdentity("email-send-job-detail")
                .storeDurably()
                .build();
    }


}
