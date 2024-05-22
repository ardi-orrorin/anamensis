package com.anamensis.batch.job.email;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailQuartzConfig {
    @Bean
    public JobDetail emailJobDetail() {
        return JobBuilder.newJob(EmailQuartzJob.class)
                .withIdentity("email-send-job-detail")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger emailJobTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule();

        return TriggerBuilder.newTrigger()
                .forJob(emailJobDetail())
                .withIdentity("email-send-job-trigger")
                .withSchedule(scheduleBuilder)
                .build();
    }
}
