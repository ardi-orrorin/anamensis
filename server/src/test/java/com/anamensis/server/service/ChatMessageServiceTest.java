package com.anamensis.server.service;

import com.anamensis.server.entity.ChatMessage;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class ChatMessageServiceTest {

    @SpyBean
    ChatMessageService cms;

    Logger log = org.slf4j.LoggerFactory.getLogger(CategoryServiceTest.class);

    @Test
    void save() {

        ChatMessage cm = new ChatMessage(
        0L,
            2L,
            1L,
            "test",
            Instant.now(),
            false,
            Instant.now()
        );

        StepVerifier.create(cms.save(cm))
            .expectNextMatches(saved -> {
                log.info("saved: {}", saved);

                assertNotNull(saved.getId());
                return true;
            })
            .verifyComplete();

    }

    @Test
    void selectAllByRoomId() {
        StepVerifier.create(cms.selectAllByRoomId(2L))
            .expectNextMatches(list -> {
                log.info("list: {}", list);

                assertTrue(list.size() > 0);
                return true;
            })

            .verifyComplete();
    }
}