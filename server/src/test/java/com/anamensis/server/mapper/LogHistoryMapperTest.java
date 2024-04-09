package com.anamensis.server.mapper;

import com.anamensis.server.entity.LogHistory;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class LogHistoryMapperTest {

    @SpyBean
    LogHistoryMapper logHistoryMapper;

    @Test
    void save() {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", "admin");
        LogHistory logHistory = LogHistory.builder()
//                        .id(1)
                        .userPk(2)
                        .method("POST")
                        .path("/api/user")
                        .uri("http://localhost:8080/api/user")
                        .body("{\"userId\":\"admin\"}")
                        .query("page=1&size=10")
                        .localAddress("1.123.12.31")
                        .headers("sdfsdf")
                        .remoteAddress("23.3.2.32")
                        .session("session")
                        .createAt(LocalDateTime.now())
                        .build();

        logHistoryMapper.save(logHistory);
    }
}