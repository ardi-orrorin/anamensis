package com.anamensis.server.service;

import com.anamensis.server.dto.SerializedJSONObject;
import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import com.anamensis.server.mapper.SystemSettingMapper;
import com.anamensis.server.provider.MailProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingMapper systemSettingMapper;

    private final MailProvider mailProvider;

    public Mono<List<SystemSetting>> findAll() {
        return Flux.fromIterable(systemSettingMapper.findAll())
            .collectList();
    }

    public Mono<SystemSetting> findByKey(SystemSettingKey key) {
        return Mono.fromCallable(() -> systemSettingMapper.findByKey(key));
    }

    public Mono<Boolean> initSystemSetting(SystemSettingKey key) {
        return Mono.fromCallable(() -> systemSettingMapper.init(key) > 0);
    }

    public Mono<SystemSetting> saveSystemSetting(SystemSettingKey key, JSONObject value) {
        return switch (key) {
            case SMTP -> this.saveSMTP(key, value);
            default   -> this.updateSystemSetting(key, value);
        };
    }

    private Mono<SystemSetting> saveSMTP(SystemSettingKey key, JSONObject value) {
        return mailProvider.testConnection(value)
            .flatMap(success -> mailProvider.updateConnection(value))
            .flatMap(success -> this.updateSystemSetting(key, value));
    }

    private Mono<SystemSetting> updateSystemSetting(SystemSettingKey key, JSONObject value) {
        SerializedJSONObject serializedJSONObject = new SerializedJSONObject(value.toString());

        SystemSetting systemMessage = new SystemSetting();
        systemMessage.setKey(key);
        systemMessage.setValue(serializedJSONObject);

        return Mono.fromCallable(() -> systemSettingMapper.update(systemMessage) > 0)
            .flatMap(updated -> {
                if(!updated) return Mono.error(new RuntimeException("Failed to update system setting"));

                return this.findByKey(key);
            });
    }

}
