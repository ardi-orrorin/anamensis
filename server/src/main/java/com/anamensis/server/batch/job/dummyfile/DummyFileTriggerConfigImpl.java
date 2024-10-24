package com.anamensis.server.batch.job.dummyfile;

import com.anamensis.server.batch.job.factory.AbstractTriggerConfig;
import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import jakarta.annotation.PostConstruct;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DummyFileTriggerConfigImpl extends AbstractTriggerConfig {

    private static final String jobName = "dummy-file-delete-job-trigger";

    public DummyFileTriggerConfigImpl(Map<SystemSettingKey, SystemSetting> systemSettings, Scheduler scheduler) {
        super(systemSettings, scheduler, jobName);
    }

    @PostConstruct
    @Override
    public void initTrigger() throws SchedulerException {
        super.initTrigger();
    }
}
