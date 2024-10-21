package com.anamensis.server.mapper;

import com.anamensis.server.dto.SerializedJSONObject;
import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import org.json.JSONObject;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("dev")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class SystemSettingMapperTest {

    @SpyBean
    private SystemSettingMapper ssm;

    Logger log = org.slf4j.LoggerFactory.getLogger(SystemSettingMapperTest.class);

    @Test
    void findAll() {

        log.info("{}", ssm.findAll(true));

    }

    @Test
    void findByKey() {
        SystemSetting ss = ssm.findByKey(SystemSettingKey.SMTP);
        log.info("ss: {}", ss);
    }

    @Test
    void update() {
        SystemSetting ss = ssm.findByKey(SystemSettingKey.SMTP);
        SerializedJSONObject json = ss.getValue();
        json.put("host", "smtp.gmail.com");
        ss.setValue(json);
        log.info("{}", json);

        ssm.update(ss);

        log.info("{}", ssm.findByKey(SystemSettingKey.SMTP));

    }

    @Test
    void init() {

        ssm.init(SystemSettingKey.SMTP);

        log.info("{}", ssm.findByKey(SystemSettingKey.SMTP));

    }
}