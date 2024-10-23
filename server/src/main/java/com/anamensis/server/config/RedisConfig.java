package com.anamensis.server.config;

import com.anamensis.server.dto.SerializedJSONObject;
import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.Map;
import java.util.Set;

import static com.anamensis.server.entity.SystemSettingKey.REDIS;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class RedisConfig {

    private final Map<SystemSettingKey, SystemSetting> systemSettings;

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {

        RedisTemplate<String, Object> template = new RedisTemplate<>();

        SerializedJSONObject redisSetting = systemSettings.get(REDIS).getValue();

        if(redisSetting.getBoolean("enabled")) {
            String host = redisSetting.getString("host");
            int port = redisSetting.getInt("port");

            LettuceConnectionFactory redisConnectionFactory = new LettuceConnectionFactory(host, port);

            redisConnectionFactory.start();

            template.setConnectionFactory(redisConnectionFactory);
        } else {
            template.setConnectionFactory(new LettuceConnectionFactory());
        }


        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        return template;
    }
}
