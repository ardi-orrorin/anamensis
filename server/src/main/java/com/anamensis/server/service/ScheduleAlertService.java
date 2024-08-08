package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.response.ScheduleAlertResponse;
import com.anamensis.server.entity.ScheduleAlert;
import com.anamensis.server.mapper.ScheduleAlertMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ScheduleAlertService {

    private final ScheduleAlertMapper scheduleAlertMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    private final static String SCHEDULE_ALERT_KEY = "schedule:alert:memberId:%s";

    public Flux<ScheduleAlertResponse.List> findAllByUserId(String userId) {
        Page page = new Page();
        page.setPage(1);
        page.setSize(30);
        return Flux.fromIterable(scheduleAlertMapper.findAllByUserId(page, userId))
            .map(ScheduleAlertResponse.List::fromEntity);
    }

    public Mono<Boolean> save(ScheduleAlert scheduleAlert) {
        return Mono.fromCallable(() -> scheduleAlertMapper.save(scheduleAlert) > 0);
    }

    public Mono<Boolean> saveToCache(String userId) {
        return this.findAllByUserId(userId)
            .flatMap(scheduleAlertResponse -> {
                String key = String.format(SCHEDULE_ALERT_KEY, userId);
                return Mono.fromCallable(() -> redisTemplate.boundListOps(key).rightPush(scheduleAlertResponse));
            })
            .last()
            .map(aBoolean -> true);
    }




}
