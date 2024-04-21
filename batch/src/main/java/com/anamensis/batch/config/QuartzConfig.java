package com.anamensis.batch.config;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail jobDetail() {
        return JobBuilder.newJob(BatchScheduledJob.class)
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger jobTrigger() {
//        ScheduleBuilder<CronTrigger> scheduleBuilder = CronScheduleBuilder.cronSchedule("0 3 14 21 4 ? 2024");

        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInSeconds(5)
                .repeatForever();


        return TriggerBuilder.newTrigger()
                .forJob(jobDetail())
                .withIdentity("jobTrigger")
                .withSchedule(scheduleBuilder)
                .build();
    }

}
