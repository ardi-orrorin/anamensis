package com.anamensis.server.service;

import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class WebSysServiceTest {

    @SpyBean
    WebSysService webSysService;

    @Test
    void findAll() {
        webSysService.findAll()
                .log()
                .subscribe();
    }

    @Test
    void findByCode() {
        webSysService.findByCode("010")
                .log().subscribe();
    }

    @Test
    void findByPermission() {
        webSysService.findByPermission(RoleType.ADMIN)
                .log().subscribe();
    }

    @Test
    void save() {
        WebSys webSys = new WebSys();
        webSys.setCode("012");
        webSys.setName("Test");
        webSys.setDescription("Test Description");
        webSys.setPermission(RoleType.ADMIN);
        webSysService.save(webSys)
                .log().subscribe();
    }

    @Test
    void saveAll() {
        List<WebSys> list = new ArrayList<>();

        for(int i = 0; i < 20 ; i++) {
            WebSys webSys = new WebSys();
            webSys.setCode("02" + i);
            webSys.setName("Test" + i);
            webSys.setDescription("Test Description" + i);
            webSys.setPermission(RoleType.ADMIN);
            list.add(webSys);
        }

        webSysService.saveAll(list)
                .log().subscribe();

    }

    @Test
    void update() {
    }

    @Test
    void deleteByCode() {
    }
}