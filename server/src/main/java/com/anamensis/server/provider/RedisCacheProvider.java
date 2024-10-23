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


    public boolean testConnection(String host, int port) {
        LettuceConnectionFactory connectionFactory = new LettuceConnectionFactory(host, port);

        connectionFactory.start();

        String ping = connectionFactory.getConnection().ping();

        connectionFactory.destroy();

        return "PONG".equals(ping);
    }

    public boolean updateConfig(SystemSetting redisSetting) {

        if(!redisSetting.getValue().getBoolean("enabled")) {
            redisTemplate.setConnectionFactory(new LettuceConnectionFactory());
            return false;
        }

        String host = redisSetting.getValue().getString("host");
        int port = redisSetting.getValue().getInt("port");

        LettuceConnectionFactory connectionFactory = new LettuceConnectionFactory(host, port);
        connectionFactory.start();
        redisTemplate.setConnectionFactory(connectionFactory);

        return true;
    }

}
