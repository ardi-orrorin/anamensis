package com.anamensis.server.batch.job.factory;

import org.quartz.SchedulerException;

public interface TriggerConfig {

    void initTrigger() throws SchedulerException;
}
