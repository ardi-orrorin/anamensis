package com.anamensis.server.batch.job.factory;

import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerKey;

import java.util.Map;

public abstract class AbstractTriggerConfig implements TriggerConfig {

    private final Map<SystemSettingKey, SystemSetting> systemSettings;

    private final Scheduler scheduler;

    private final String TRIGGER_KEY;

    public AbstractTriggerConfig(Map<SystemSettingKey, SystemSetting> systemSettings, Scheduler scheduler, String TRIGGER_KEY) {
        this.systemSettings = systemSettings;
        this.scheduler = scheduler;
        this.TRIGGER_KEY = TRIGGER_KEY;
    }

    @Override
    public void initTrigger() throws SchedulerException {
        boolean enabled = systemSettings.get(SystemSettingKey.TRIGGER).getValue()
            .getJSONObject(TRIGGER_KEY)
            .getBoolean("enabled");

        if(enabled) return ;

        scheduler.pauseTrigger(new TriggerKey(TRIGGER_KEY));
    }
}
