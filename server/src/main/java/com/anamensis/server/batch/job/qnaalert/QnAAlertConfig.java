//package com.anamensis.server.batch.job.qnaalert;
//
//import org.quartz.*;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class QnAAlertConfig {
//
//    @Bean
//    public Trigger qnaAlertJobTrigger() {
//        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
//            .withRepeatCount(2)
//            .withIntervalInSeconds(5);
////            .withIntervalInMinutes(1)
////            .repeatForever();
//
//        return TriggerBuilder.newTrigger()
//            .forJob(qnaAlertJobDetail())
//            .withIdentity("qna-alert-job-trigger")
//            .withSchedule(scheduleBuilder)
//            .build();
//    }
//
//    @Bean
//    public JobDetail qnaAlertJobDetail() {
//        return JobBuilder.newJob(QnAAlertJob.class)
//            .withIdentity("qna-alert-job-detail")
//            .storeDurably()
//            .build();
//    }
//}
