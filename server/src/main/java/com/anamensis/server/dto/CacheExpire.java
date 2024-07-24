package com.anamensis.server.dto;

import java.util.concurrent.TimeUnit;

public record CacheExpire(
    long timeout,
    TimeUnit timeUnit
) {}
