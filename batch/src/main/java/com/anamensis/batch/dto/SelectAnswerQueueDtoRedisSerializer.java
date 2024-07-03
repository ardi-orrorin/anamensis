package com.anamensis.batch.dto;

import org.springframework.core.serializer.Deserializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

import java.io.*;

public class SelectAnswerQueueDtoRedisSerializer implements RedisSerializer<SelectAnswerQueueDto> {

    @Override
    public byte[] serialize(SelectAnswerQueueDto o) {
        return o.toString().getBytes();
    }

    @Override
    public SelectAnswerQueueDto deserialize(byte[] bytes) throws SerializationException {
        ByteArrayInputStream baos = new ByteArrayInputStream(bytes);
        try {
            ObjectInputStream ois = new ObjectInputStream(baos);
            return (SelectAnswerQueueDto) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
