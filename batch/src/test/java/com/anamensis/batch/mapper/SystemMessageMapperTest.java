package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.SystemMessage;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("local")
class SystemMessageMapperTest {

    @SpyBean
    SystemMessageMapper systemMessageMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(SystemMessageMapperTest.class);

    @Test
    void findByWebSysPk() {
        SystemMessage sm = systemMessageMapper.findByWebSysPk("015").orElseThrow();
        log.info(sm.toString());
    }
}