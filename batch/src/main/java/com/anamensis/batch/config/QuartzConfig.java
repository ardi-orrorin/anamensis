package com.anamensis.batch.config;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail jobDetail() {
        return JobBuilder.newJob(BatchScheduledJob.class)
                .withIdentity("jobDetail1")
                .storeDurably()
                .build();
    }

    @Bean
    public JobDetail jobDetail2() {
        return JobBuilder.newJob(BatchScheduledJob2.class)
                .withIdentity("jobDetail2")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger jobTrigger1() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInSeconds(60)
                .withRepeatCount(1);

        return TriggerBuilder.newTrigger()
                .forJob(jobDetail())
                .withIdentity("jobTrigger")
                .withSchedule(scheduleBuilder)
                .build();
    }

//    @Bean
//    public Trigger jobTrigger2() {
//        SimpleScheduleBuilder scheduleBuilder2 = SimpleScheduleBuilder.simpleSchedule()
//                .withIntervalInSeconds(3)
//                .repeatForever();
//
//        return TriggerBuilder.newTrigger()
//                .forJob(jobDetail2())
//                .withIdentity("jobTrigger2")
//                .withSchedule(scheduleBuilder2)
//                .build();
//    }
//

}
