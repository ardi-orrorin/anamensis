package com.anamensis.server.batch.job.dummyfile;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DummyFileTrigger {

    @Bean
    public Trigger DummyFileDeleteJobTrigger() {
        CronScheduleBuilder cronScheduleBuilder = CronScheduleBuilder.cronSchedule("0 0 23 * * ?")
                .withMisfireHandlingInstructionDoNothing();

        return TriggerBuilder.newTrigger()
                .forJob(dummyFileDeleteJobDetail())
                .withIdentity("dummy-file-delete-job-trigger")
                .withSchedule(cronScheduleBuilder)
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
