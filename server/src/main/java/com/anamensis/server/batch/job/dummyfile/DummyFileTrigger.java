package com.anamensis.server.batch.job.dummyfile;

import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import lombok.RequiredArgsConstructor;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DummyFileTrigger {

    private final Map<SystemSettingKey, SystemSetting> systemSettings;

    @Bean
    public Trigger DummyFileDeleteJobTrigger() {

        SystemSetting cronSetting = systemSettings.get(SystemSettingKey.TRIGGER);

        String cron = cronSetting.getValue()
            .getJSONObject("dummy-file-delete-job-trigger")
            .getString("cron");


        CronScheduleBuilder cronScheduleBuilder = CronScheduleBuilder.cronSchedule(cron)
                .withMisfireHandlingInstructionDoNothing();

        return TriggerBuilder.newTrigger()
                .forJob(DummyFileDeleteJobDetail())
                .withIdentity("dummy-file-delete-job-trigger")
                .withSchedule(cronScheduleBuilder)
                .build();
    }


    @Bean
    public JobDetail DummyFileDeleteJobDetail() {
        return JobBuilder.newJob(DummyFileJob.class)
            .withIdentity("dummy-file-delete-job-detail")
            .storeDurably()
            .build();
    }


}
