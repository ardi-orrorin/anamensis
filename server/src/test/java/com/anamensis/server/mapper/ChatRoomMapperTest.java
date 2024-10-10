package com.anamensis.server.mapper;

import com.anamensis.server.dto.RoomType;
import com.anamensis.server.entity.ChatRoom;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.autoconfigure.graphql.tester.AutoConfigureGraphQlTester;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//@Transactional
class ChatRoomMapperTest {

    @SpyBean
    private ChatRoomMapper chatRoomMapper;

    private Logger log = LoggerFactory.getLogger(ChatRoomMapperTest.class);

    @Test
    void selectById() {

        Optional<ChatRoomResultMap.ChatRoom> result = chatRoomMapper.selectById(1L);
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

    @Test
    void save() {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setType(RoomType.PRIVATE);
        chatRoom.setName("test");
        chatRoom.setHostId(1L);
        chatRoom.setLastMessage("");
        chatRoom.setCreatedAt(Instant.now());
        chatRoom.setUpdatedAt(Instant.now());

        int result = chatRoomMapper.save(chatRoom);

        assertEquals(1, result);
        assertTrue(chatRoom.getId() > 0);

        log.info("result: {}", result);
        log.info("chatRoom: {}", chatRoom);
    }

    @Test
    void saveChatRoomUser() {
        int result = chatRoomMapper.saveChatRoomUser(2L, List.of(1L, 3L));

        assertEquals(2, result);

        log.info("result: {}", result);
    }
}