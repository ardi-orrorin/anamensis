package com.anamensis.server.mapper;

import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class WebSysMapperTest {

    @SpyBean
    WebSysMapper webSysMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(WebSysMapperTest.class);

    @Test
    void findAll() {
        webSysMapper.findAll().forEach(webSys -> log.info(webSys.toString()));
    }

    @Test
    void findByCode() {

//        webSysMapper.findByCode("01").orElseThrow(
//            () -> new RuntimeException("Not found")
//        );

        WebSys sd = webSysMapper.findByCode("010").orElseThrow(
                () -> new RuntimeException("Not found")
        );

        log.info(sd.toString());

    }

    @Test
    void findByPermission() {

        webSysMapper.findByPermission(RoleType.ADMIN).forEach(webSys -> log.info(webSys.toString()));
        webSysMapper.findByPermission(RoleType.USER).forEach(webSys -> log.info(webSys.toString()));
        webSysMapper.findByPermission(RoleType.GUEST).forEach(webSys -> log.info(webSys.toString()));
        webSysMapper.findByPermission(RoleType.MASTER).forEach(webSys -> log.info(webSys.toString()));

    }

    @Test
    void save() {
        WebSys webSys = new WebSys();
        webSys.setCode("1234");
        webSys.setName("name");
        webSys.setDescription("description");
        webSys.setPermission(RoleType.ADMIN);

        webSysMapper.save(webSys);
    }

    @Test
    void saveAll() {
        List<WebSys> webSysList = new ArrayList<>();

        for (int i = 0; i < 20 ; i++) {
            WebSys webSys = new WebSys();
            webSys.setCode("01" + i);
            webSys.setName("name" + i);
            webSys.setDescription("description" + i);
            webSys.setPermission(RoleType.ADMIN);
            webSysList.add(webSys);
        }

        webSysMapper.saveAll(webSysList);
    }

    @Test
    void update() {

        WebSys webSys = webSysMapper.findByCode("010").orElseThrow(
                () -> new RuntimeException("Not found")
        );

        webSys.setName("name2222222222");
        webSys.setDescription("description2");
        webSys.setPermission(RoleType.ADMIN);

        webSysMapper.update(webSys);

    }

    @Test
    void deleteByCode() {
        webSysMapper.deleteByCode("000");
    }
}