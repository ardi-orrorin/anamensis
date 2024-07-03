package com.anamensis.batch.config;

import com.anamensis.batch.dto.SelectAnswerQueueDto;
import com.anamensis.batch.dto.SelectAnswerQueueDtoRedisSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

//    @Bean
//    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
//        RedisTemplate<String, Object> template = new RedisTemplate<>();
//        template.setConnectionFactory(redisConnectionFactory);
//
//        template.setKeySerializer(new StringRedisSerializer());
//        template.setHashKeySerializer(new StringRedisSerializer());
//
//        return template;
//    }
//
    @Bean
    public RedisTemplate<String, SelectAnswerQueueDto> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, SelectAnswerQueueDto> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new SelectAnswerQueueDtoRedisSerializer());
        template.setHashValueSerializer(new SelectAnswerQueueDtoRedisSerializer());

        return template;
    }
}
