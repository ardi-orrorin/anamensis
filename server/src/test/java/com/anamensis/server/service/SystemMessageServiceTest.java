package com.anamensis.server.service;

import com.anamensis.server.entity.SystemMessage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SystemMessageServiceTest {


    @SpyBean
    SystemMessageService sms;

    @Test
    void findById() {
        sms.findById(1)
                .log()
                .subscribe();
    }

    @Test
    void findByWebSysPk() {
        sms.findByWebSysPk("011")
                .log()
                .subscribe();
    }

    @Test
    void save() {
        SystemMessage sy = new SystemMessage();
        sy.setWebSysPk("011");
        sy.setSubject("subject test");
        sy.setContent("content test");
        sy.setExtra1("extra1 test");

        sms.save(sy)
                .log()
                .subscribe();
    }

    @Test
    void update() {
        SystemMessage sy = new SystemMessage();
        sy.setId(1);
        sy.setContent("content test update");
        sy.setExtra3("extra3 test update");
        sms.update(sy)
                .log()
                .subscribe();
    }

    @Test
    void updateIsUse() {
        SystemMessage sy = new SystemMessage();
        sy.setId(1);
        sms.updateIsUse(1, true)
                .doOnSuccess(Assertions::assertTrue)
                .subscribe();

    }

    @Test
    void delete() {
        sms.delete(1)
                .log()
                .subscribe();
    }
}