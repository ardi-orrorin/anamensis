package com.anamensis.batch.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.VirtualThreadTaskExecutor;

@Configuration
public class config {
    @Bean
    public VirtualThreadTaskExecutor taskExecutor() {
        return new VirtualThreadTaskExecutor("task-");
    }

}

