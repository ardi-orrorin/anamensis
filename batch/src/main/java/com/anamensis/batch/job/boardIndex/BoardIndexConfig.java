package com.anamensis.batch.job.boardIndex;

import com.anamensis.batch.job.dummyfile.DummyFileJob;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BoardIndexConfig {
    @Bean
    public Trigger boardIndexJobTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule();
        scheduleBuilder.withRepeatCount(1);
        scheduleBuilder.withIntervalInSeconds(10);

        return TriggerBuilder.newTrigger()
            .forJob(boardIndexJobDetail())
            .withIdentity("board-index-job-trigger")
            .withSchedule(scheduleBuilder)
            .build();
    }

    @Bean
    public JobDetail boardIndexJobDetail() {
        return JobBuilder.newJob(BoardIndexJob.class)
            .withIdentity("board-index-job-detail")
            .storeDurably()
            .build();
    }
}
