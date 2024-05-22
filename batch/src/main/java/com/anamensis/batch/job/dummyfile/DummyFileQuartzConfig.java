package com.anamensis.batch.job.dummyfile;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DummyFileQuartzConfig {

    @Bean
    public JobDetail dummyFileDeleteJobDetail() {
        return JobBuilder.newJob(DummyFileQuartzJob.class)
                .withIdentity("dummy-file-delete-job-detail")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger DummyFileDeleteJobTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule();

        return TriggerBuilder.newTrigger()
                .forJob(dummyFileDeleteJobDetail())
                .withIdentity("dummy-file-delete-job-trigger")
                .withSchedule(scheduleBuilder)
                .build();
    }
}
