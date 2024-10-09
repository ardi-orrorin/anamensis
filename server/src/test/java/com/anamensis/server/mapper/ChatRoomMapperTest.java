package com.anamensis.server.mapper;

import com.anamensis.server.entity.ChatRoom;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class ChatRoomMapperTest {

    @SpyBean
    private ChatRoomMapper chatRoomMapper;

    private Logger log = LoggerFactory.getLogger(ChatRoomMapperTest.class);

    @Test
    void selectById() {

        ChatRoomResultMap.ChatRoom result = chatRoomMapper.selectById(1L);
        assertNotNull(result);

        log.info("result: {}", result);

    }

    @Test
    void selectAll() {

        List<ChatRoom> list = chatRoomMapper.selectAll("test");

        assertNotNull(list);

        assertTrue(list.size() > 0);

        log.info("list: {}", list);

    }
}