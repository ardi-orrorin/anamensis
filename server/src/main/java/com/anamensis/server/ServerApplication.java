package com.anamensis.server;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.ZoneId;
import java.util.TimeZone;

@SpringBootApplication
public class ServerApplication {

    @Value("${spring.time-zone}")
    private String TIME_ZONE;

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(TIME_ZONE));
    }

}
