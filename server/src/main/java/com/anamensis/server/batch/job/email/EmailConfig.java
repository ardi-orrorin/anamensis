//package com.anamensis.server.batch.job.email;
//
//import org.quartz.*;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class EmailConfig {
//
//    @Bean
//    public Trigger emailJobTrigger() {
//        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
//                .withIntervalInMinutes(1)
//                .withRepeatCount(10);
//
////        CronScheduleBuilder cronScheduleBuilder = CronScheduleBuilder.cronSchedule("0 10 22 22 5 ? 2024");
//
//        return TriggerBuilder.newTrigger()
//                .forJob(emailJobDetail())
//                .withIdentity("email-send-job-trigger")
////                .withSchedule(cronScheduleBuilder)
//                .withSchedule(scheduleBuilder)
//                .build();
//    }
//
//    @Bean
//    public JobDetail emailJobDetail() {
//        return JobBuilder.newJob(EmailJob.class)
//                .withIdentity("email-send-job-detail")
//                .storeDurably()
//                .build();
//    }
//
//
//}
