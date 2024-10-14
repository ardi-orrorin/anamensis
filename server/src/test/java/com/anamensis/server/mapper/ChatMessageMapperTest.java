package com.anamensis.server.mapper;

import com.anamensis.server.dto.response.ChatMessageResponse;
import com.anamensis.server.entity.ChatMessage;
import com.anamensis.server.resultMap.ChatMessageResultMap;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ChatMessageMapperTest {


    @SpyBean
    private ChatMessageMapper chatMessageMapper;

    private Logger log = LoggerFactory.getLogger(ChatRoomMapperTest.class);

    @Test
    void save() {

        ChatMessage chat = new ChatMessage(
            0L,
            2L,
            1L,
            "test",
            Instant.now(),
            false,
            Instant.now()
        );

        int result = chatMessageMapper.save(chat);

        assertEquals(1, result);

        log.info("result: {}", result);

        log.info("chat: {}", chat);


    }

    @Test
    void findAllByChatRoomId() {
        List<ChatMessageResultMap.Detail> list = chatMessageMapper.findAllByChatRoomId(2L, Instant.now().minus(2, ChronoUnit.DAYS));

        assertNotNull(list);

        log.info("list: {}", list);
    }
}