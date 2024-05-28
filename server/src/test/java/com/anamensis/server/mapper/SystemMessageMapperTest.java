package com.anamensis.server.mapper;

import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.SystemMessage;
import com.anamensis.server.entity.WebSys;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SystemMessageMapperTest {

    @SpyBean
    SystemMessageMapper systemMessageMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(SystemMessageMapperTest.class);

    @SpyBean
    WebSysMapper webSysMapper;

    WebSys webSysbase = new WebSys();

    SystemMessage sm = new SystemMessage();

    @BeforeAll
    public void setUp() {
        webSysbase.setCode("101");
        webSysbase.setName("name");
        webSysbase.setDescription("description");
        webSysbase.setPermission(RoleType.ADMIN);
        webSysMapper.save(webSysbase);

        sm.setWebSysPk(webSysbase.getCode());
        sm.setSubject("subject");
        sm.setContent("content");
        sm.setCreateAt(LocalDateTime.now());
        sm.setUpdateAt(LocalDateTime.now());
        sm.setExtra1("extra1");
        sm.setExtra2("extra2");
        sm.setExtra3("extra3");
        systemMessageMapper.save(sm);
    }


    @Test
    @Order(1)
    @DisplayName("저장")
    void save() {
        SystemMessage systemMessage = new SystemMessage();
        systemMessage.setWebSysPk(webSysbase.getCode());

        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            systemMessageMapper.save(systemMessage);
        });

        systemMessage.setSubject("subject2");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            systemMessageMapper.save(systemMessage);
        });

        systemMessage.setCreateAt(LocalDateTime.now());
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            systemMessageMapper.save(systemMessage);
        });
        systemMessage.setUpdateAt(LocalDateTime.now());
        assertDoesNotThrow(() -> {
            systemMessageMapper.save(systemMessage);
        });

        systemMessage.setSubject("""
                255자 제한 테스트
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                sldifjslifjlsifjlsifjlsdifjslidjflisjflsifjlsidjflisfjlsifjlsifjlsfjlisjdflsiddf
                """);
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            systemMessageMapper.save(systemMessage);
        });


        systemMessage.setSubject("subject2");
        systemMessage.setContent("content2");
        systemMessage.setExtra1("extra12");
        systemMessage.setExtra2("extra22");
        systemMessage.setExtra3("extra32");

        assertDoesNotThrow(() -> {
            systemMessageMapper.save(systemMessage);
        });

    }

    @Test
    @Order(2)
    @DisplayName("id로 조회")
    void findById() {
        assertTrue(systemMessageMapper.findById(100).isEmpty());
        assertThrowsExactly(NoSuchElementException.class, () -> {
            systemMessageMapper.findById(100).get();
        });
        assertThrowsExactly(RuntimeException.class, () -> {
            systemMessageMapper.findById(100).orElseThrow(() ->
                    new RuntimeException("Not found")
            );
        });

        assertTrue(systemMessageMapper.findById(sm.getId()).isPresent());
        assertDoesNotThrow(() -> {
            systemMessageMapper.findById(sm.getId()).get();
        });
        SystemMessage systemMessage = systemMessageMapper.findById(sm.getId()).get();
        assertEquals(sm.getId(), systemMessage.getId());
        assertEquals(sm.getWebSysPk(), systemMessage.getWebSysPk());
        assertEquals(sm.getSubject(), systemMessage.getSubject());
        assertEquals(sm.getContent(), systemMessage.getContent());
        assertEquals(sm.getCreateAt(), systemMessage.getCreateAt());
        assertEquals(sm.getUpdateAt(), systemMessage.getUpdateAt());
        assertEquals(sm.getExtra1(), systemMessage.getExtra1());
        assertEquals(sm.getExtra2(), systemMessage.getExtra2());
        assertEquals(sm.getExtra3(), systemMessage.getExtra3());
        assertEquals(sm.getExtra4(), systemMessage.getExtra4());
        assertEquals(sm.getExtra5(), systemMessage.getExtra5());
        assertTrue(systemMessage.isUse());

    }

    @Test
    @Order(3)
    @DisplayName("webSysPk로 조회")
    void findByWebSysPk() {
        SystemMessage systemMessage = new SystemMessage();
        systemMessage.setWebSysPk(webSysbase.getCode());
        systemMessage.setSubject("subject");
        systemMessage.setContent("content");
        systemMessage.setCreateAt(LocalDateTime.now());
        systemMessage.setUpdateAt(LocalDateTime.now());
        systemMessage.setExtra1("extra1");
        systemMessage.setExtra2("extra2");
        systemMessage.setExtra3("extra3");
        systemMessageMapper.save(systemMessage);

        List<SystemMessage> emptyList = systemMessageMapper.findByWebSysPk("100");
        assertTrue(emptyList.isEmpty());


        List<SystemMessage> list = systemMessageMapper.findByWebSysPk(webSysbase.getCode());
        assertTrue(list.size() > 0);
        assertTrue(list.stream().anyMatch(
                s -> s.getId() == systemMessage.getId()
        ));
        assertTrue(list.stream().anyMatch(
                s -> s.getId() == sm.getId()
        ));

    }

    @Test
    @Order(4)
    @DisplayName("수정")
    void update() {
        SystemMessage systemMessage = new SystemMessage();
        systemMessage.setWebSysPk(webSysbase.getCode());
        systemMessage.setSubject("subject");
        systemMessage.setContent("content");
        systemMessage.setCreateAt(LocalDateTime.now());
        systemMessage.setUpdateAt(LocalDateTime.now());
        systemMessage.setExtra1("extra1");
        systemMessage.setExtra2("extra2");
        systemMessage.setExtra3("extra3");
        systemMessageMapper.save(systemMessage);

        SystemMessage updateSystemMessage = systemMessageMapper.findById(systemMessage.getId()).get();

        updateSystemMessage.setSubject("");
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });
        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
                assertNotEquals("", s.getSubject());
                assertEquals(systemMessage.getSubject(), s.getSubject());
            }
        );

        updateSystemMessage.setSubject(null);
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });
        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
                    assertNotEquals("", s.getSubject());
                    assertEquals(systemMessage.getSubject(), s.getSubject());
                }
        );

        updateSystemMessage.setSubject("subject2");
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });
        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
                assertNotEquals(systemMessage.getSubject(), s.getSubject());
                assertEquals(updateSystemMessage.getSubject(), s.getSubject());
            }
        );

        updateSystemMessage.setContent("");
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });
        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
                assertNotEquals("", s.getContent());
                assertEquals(systemMessage.getContent(), s.getContent());
            }
        );

        updateSystemMessage.setContent(null);
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });
        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
                    assertNotEquals("", s.getContent());
                    assertEquals(systemMessage.getContent(), s.getContent());
                }
        );

        updateSystemMessage.setContent("content2");
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });
        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
                assertNotEquals(systemMessage.getContent(), s.getContent());
                assertEquals(updateSystemMessage.getContent(), s.getContent());
            }
        );


        updateSystemMessage.setUpdateAt(null);
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });

        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
                assertNotEquals(null, s.getUpdateAt());
                assertEquals(systemMessage.getUpdateAt(), s.getUpdateAt());
            }
        );

        updateSystemMessage.setUpdateAt(LocalDateTime.now());
        assertDoesNotThrow(() -> {
            assertEquals(1, systemMessageMapper.update(updateSystemMessage));
        });
        systemMessageMapper.findById(systemMessage.getId()).ifPresent(s -> {
            assertNotEquals(systemMessage.getUpdateAt(), s.getUpdateAt());
            assertEquals(updateSystemMessage.getUpdateAt(), s.getUpdateAt());
        });
    }

    @Test
    @Order(5)
    @DisplayName("사용여부 수정")
    void updateIsUse() {
        SystemMessage systemMessage = new SystemMessage();
        systemMessage.setWebSysPk(webSysbase.getCode());
        systemMessage.setSubject("subject");
        systemMessage.setContent("content");
        systemMessage.setCreateAt(LocalDateTime.now());
        systemMessage.setUpdateAt(LocalDateTime.now());
        systemMessage.setExtra1("extra1");
        systemMessage.setExtra2("extra2");
        systemMessage.setExtra3("extra3");
        systemMessageMapper.save(systemMessage);

        SystemMessage usm = systemMessageMapper.findById(systemMessage.getId()).get();

        assertEquals(0, systemMessageMapper.updateIsUse(100, false, LocalDateTime.now()));

        assertEquals(1, systemMessageMapper.updateIsUse(usm.getId(), false, LocalDateTime.now()));
        assertFalse(systemMessageMapper.findById(usm.getId()).get().isUse());
        systemMessageMapper.findByWebSysPk(webSysbase.getCode()).forEach(s -> {
            if (s.getId() == usm.getId()) {
                assertFalse(s.isUse());
            }
        });
    }

    @Test
    @Order(6)
    @DisplayName("삭제")
    void delete() {
        SystemMessage systemMessage = new SystemMessage();
        systemMessage.setWebSysPk(webSysbase.getCode());
        systemMessage.setSubject("subject");
        systemMessage.setContent("content");
        systemMessage.setCreateAt(LocalDateTime.now());
        systemMessage.setUpdateAt(LocalDateTime.now());
        systemMessage.setExtra1("extra1");
        systemMessage.setExtra2("extra2");
        systemMessage.setExtra3("extra3");
        systemMessageMapper.save(systemMessage);

        assertEquals(0, systemMessageMapper.delete(100));
        assertTrue(systemMessageMapper.findById(systemMessage.getId()).isPresent());
        assertEquals(1, systemMessageMapper.delete(systemMessage.getId()));
        assertTrue(systemMessageMapper.findById(systemMessage.getId()).isEmpty());



    }
}