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

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleAlertService {

    private final ScheduleAlertMapper scheduleAlertMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    private final static String SCHEDULE_ALERT_KEY = "schedule:alert:memberId:%s";

    public Flux<ScheduleAlertResponse.List> findAllByUserId(String userId) {
        return Flux.fromIterable(scheduleAlertMapper.findAllByUserId(userId))
            .map(ScheduleAlertResponse.List::from);
    }

    public Mono<Boolean> save(ScheduleAlert scheduleAlert) {
        return Mono.fromCallable(() -> scheduleAlertMapper.save(scheduleAlert) > 0);
    }

    public Mono<Boolean> saveAll(List<ScheduleAlert> scheduleAlerts) {
        return Mono.fromCallable(() -> scheduleAlertMapper.saveAll(scheduleAlerts) > 0);
    }

    public Mono<Boolean> updateAll(List<ScheduleAlert> nextSchAlert, long boardId, String userId) {
        return Flux.fromIterable(scheduleAlertMapper.findAllByBoardId(userId, boardId))
            .doOnNext(prevSchAlert -> {
                Optional<ScheduleAlert> findSchAlert = nextSchAlert.stream().filter(alert ->
                    alert.getHashId().equals(prevSchAlert.getHashId())
                    && alert.getBoardId() == prevSchAlert.getBoardId()
                ).findFirst();

                findSchAlert.map(scheduleAlert -> {
                    updateScheduleAlert(prevSchAlert, scheduleAlert);
                    return nextSchAlert.remove(scheduleAlert);
                }).orElseGet(() ->
                    scheduleAlertMapper.delete(prevSchAlert.getId()) > 0
                );
            })
            .then(saveAll(nextSchAlert));
    }

    public Mono<Boolean> updateIsRead(long id, String userId) {
        return Mono.fromCallable(() -> scheduleAlertMapper.updateIsRead(id, userId) > 0);
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

    private void updateScheduleAlert(ScheduleAlert prevSchAlert, ScheduleAlert nextSchAlert) {
        nextSchAlert.setId(prevSchAlert.getId());
        nextSchAlert.setUserId(prevSchAlert.getUserId());
        scheduleAlertMapper.update(nextSchAlert);
    }



}
