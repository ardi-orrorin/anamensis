package com.anamensis.server.provider;

import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import com.anamensis.server.mapper.SystemSettingMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RedisCacheProvider {

    private final Map<SystemSettingKey, SystemSetting> systemSettings;
    private final SystemSettingMapper systemSettingMapper;

    @Getter
    private final RedisTemplate<String, Object> redisTemplate;

    public boolean enable() {
        return systemSettings.get(SystemSettingKey.REDIS).getValue()
            .getBoolean("enabled");
    }

    public void updateConfig() {
        SystemSetting redisSetting = systemSettingMapper.findByKey(SystemSettingKey.REDIS);

        if(redisSetting == null) return;

        systemSettings.put(SystemSettingKey.REDIS, redisSetting);

        if(!redisSetting.getValue().getBoolean("enabled")) {
            redisTemplate.setConnectionFactory(new LettuceConnectionFactory());
            return ;
        }

        String host = redisSetting.getValue().getString("host");
        int port = redisSetting.getValue().getInt("port");

        redisTemplate.setConnectionFactory(new LettuceConnectionFactory(host, port));
    }




}
