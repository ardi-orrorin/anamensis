package com.anamensis.server.mapper;

import com.anamensis.server.entity.SystemMessage;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SystemMessageMapperTest {

    @SpyBean
    SystemMessageMapper systemMessageMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(SystemMessageMapperTest.class);

    @Test
    void findById() {

        SystemMessage sy = systemMessageMapper.findById(1).orElseThrow(
                () -> new RuntimeException("Not found")
        );

        log.info(sy.toString());

    }

    @Test
    void findByWebSysPk() {

        systemMessageMapper.findByWebSysPk("010").forEach(systemMessage -> log.info(systemMessage.toString()));

    }

    @Test
    void save() {
        SystemMessage systemMessage = new SystemMessage();
        systemMessage.setWebSysPk("010");
        systemMessage.setSubject("subject");
        systemMessage.setContent("content");
        systemMessage.setCreateAt(LocalDateTime.now());
        systemMessage.setUpdateAt(LocalDateTime.now());
        systemMessage.setExtra1("extra1");
        systemMessage.setExtra2("extra2");
        systemMessage.setExtra3("extra3");

        systemMessageMapper.save(systemMessage);
    }

    @Test
    void update() {
        SystemMessage systemMessage = systemMessageMapper.findById(1).orElseThrow(
                () -> new RuntimeException("Not found")
        );

        systemMessage.setSubject("subject update");
        systemMessage.setContent("content update");
        systemMessage.setUpdateAt(LocalDateTime.now());
        systemMessage.setExtra1("extra1 update");

        systemMessageMapper.update(systemMessage);

    }

    @Test
    void updateIsUse() {
        systemMessageMapper.updateIsUse(1, false);
    }

    @Test
    void delete() {
        systemMessageMapper.delete(2);
    }
}