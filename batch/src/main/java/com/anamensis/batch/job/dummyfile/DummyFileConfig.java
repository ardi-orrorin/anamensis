package com.anamensis.batch.job.dummyfile;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DummyFileConfig {

    @Bean
    public Trigger DummyFileDeleteJobTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule();
        scheduleBuilder.withRepeatCount(1);

        return TriggerBuilder.newTrigger()
                .forJob(dummyFileDeleteJobDetail())
                .withIdentity("dummy-file-delete-job-trigger")
                .withSchedule(scheduleBuilder)
                .build();
    }

    @Bean
    public JobDetail dummyFileDeleteJobDetail() {
        return JobBuilder.newJob(DummyFileJob.class)
                .withIdentity("dummy-file-delete-job-detail")
                .storeDurably()
                .build();
    }

}
