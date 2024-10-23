package com.anamensis.server.service;

import com.anamensis.server.dto.SerializedJSONObject;
import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import com.anamensis.server.mapper.SystemSettingMapper;
import com.anamensis.server.provider.MailProvider;
import com.anamensis.server.provider.RedisCacheProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingMapper systemSettingMapper;

    private final MailProvider mailProvider;

    private final RedisCacheProvider redisCacheProvider;


    private final Map<SystemSettingKey, SystemSetting> systemSettings;

    public Mono<List<SystemSetting>> findAll(boolean isPublic) {
        return Flux.fromIterable(systemSettingMapper.findAll(isPublic))
            .collectList();
    }

    public Mono<SystemSetting> findByKey(SystemSettingKey key) {
        return Mono.fromCallable(() -> systemSettingMapper.findByKey(key));
    }

    public Mono<Boolean> initSystemSetting(SystemSettingKey key) {
        return Mono.fromCallable(() -> systemSettingMapper.init(key) > 0);
    }

    public Mono<SystemSetting> save(SystemSettingKey key, JSONObject value) {
        return this.saveSystemSetting(key, value)
            .flatMap(success -> this.findByKey(key))
            .flatMap(systemSetting -> {
                systemSettings.put(key, systemSetting);
                return Mono.just(systemSetting);
            });
    }

    public Mono<Boolean> saveSystemSetting(SystemSettingKey key, JSONObject value) {
        return switch (key) {
            case SMTP       -> this.saveSMTP(key, value);
            case SIGN_UP    -> this.saveSignUp(key, value);
            case LOGIN      -> this.saveLogin(key, value);
            case REDIS      -> this.saveRedis(key, value);
            default         -> this.updateSystemSetting(key, value);
        };
    }

    private Mono<Boolean> saveRedis(SystemSettingKey key, JSONObject value) {

        String host = value.getString("host");
        int port = value.getInt("port");
        boolean enabled = value.getBoolean("enabled");

        if(enabled && (host == null || host.isEmpty() || port <= 0)) {
            return Mono.error(new RuntimeException("Invalid Redis configuration"));
        }

        if(enabled && !redisCacheProvider.testConnection(host, port)) {
            return Mono.error(new RuntimeException("Failed to connect to Redis"));
        }

        return this.updateSystemSetting(key, value)
            .flatMap(success -> {
                if(!enabled || !success) {
                    return Mono.just(success);
                }

                return this.findByKey(SystemSettingKey.REDIS)
                        .flatMap(redisSetting -> {
                            boolean result = redisCacheProvider.updateConfig(redisSetting);

                            return Mono.just(result);
                        });
            });
    }

    private Mono<Boolean> saveLogin(SystemSettingKey key, JSONObject value) {
        return this.findByKey(key)
            .flatMap(loginSetting -> {
                if(!value.getBoolean("emailAuth")) return Mono.just(loginSetting);

                return this.findByKey(SystemSettingKey.SMTP)
                    .flatMap(smtpSetting -> {
                        if(!smtpSetting.getValue().getBoolean("enabled")) {
                            loginSetting.getValue().put("emailAuth", false);
                            return this.updateSystemSetting(key, loginSetting.getValue());
                        }

                        return Mono.just(loginSetting);
                    });
            })
            .flatMap(loginSetting -> this.updateSystemSetting(key, value));
    }

    private Mono<Boolean> saveSignUp(SystemSettingKey key, JSONObject value) {
        return this.findByKey(key)
            .flatMap(signUpSetting -> {
                if(!value.getBoolean("emailVerification")) return Mono.just(signUpSetting);

                return this.findByKey(SystemSettingKey.SMTP)
                    .flatMap(smtpSetting -> {
                        if(!smtpSetting.getValue().getBoolean("enabled")) {
                            signUpSetting.getValue().put("emailVerification", false);
                            return this.updateSystemSetting(key, signUpSetting.getValue());
                        }

                        return Mono.just(signUpSetting);
                    });
            })
            .flatMap(signUpSetting -> this.updateSystemSetting(key, value));
    }

    private Mono<Boolean> saveSMTP(SystemSettingKey key, JSONObject value) {
        return mailProvider.testConnection(value)
            .flatMap(success -> mailProvider.updateConnection(value))
            .flatMap(success -> this.updateSystemSetting(key, value))
            .flatMap(success -> {
                if(value.getBoolean("enabled")) return Mono.just(success);

                Mono<Boolean> disabledEmailVerification = this.findByKey(SystemSettingKey.SIGN_UP)
                    .flatMap(signUpSetting -> {
                        JSONObject signUpValue = signUpSetting.getValue();
                        signUpValue.put("emailVerification", false);
                        return this.saveSystemSetting(SystemSettingKey.SIGN_UP, signUpValue);
                    })
                    .subscribeOn(Schedulers.boundedElastic());

                Mono<Boolean> disabledEmailAuth = this.findByKey(SystemSettingKey.LOGIN)
                    .flatMap(loginSetting -> {
                        JSONObject loginValue = loginSetting.getValue();
                        loginValue.put("emailAuth", false);
                        return this.saveSystemSetting(SystemSettingKey.LOGIN, loginValue);
                    })
                    .subscribeOn(Schedulers.boundedElastic());

                return Mono.zip(disabledEmailVerification, disabledEmailAuth)
                    .flatMap(t2 ->Mono.just(success));
            });
    }

    private Mono<Boolean> updateSystemSetting(SystemSettingKey key, JSONObject value) {
        SerializedJSONObject serializedJSONObject = new SerializedJSONObject(value.toString());

        SystemSetting systemMessage = new SystemSetting();
        systemMessage.setKey(key);
        systemMessage.setValue(serializedJSONObject);

        return Mono.fromCallable(() -> systemSettingMapper.update(systemMessage) > 0)
            .flatMap(updated -> {
                if(!updated) return Mono.error(new RuntimeException("Failed to update system setting"));
                return Mono.just(updated);
            });
    }

}
