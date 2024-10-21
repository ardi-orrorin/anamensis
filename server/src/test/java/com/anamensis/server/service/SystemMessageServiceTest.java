package com.anamensis.server.service;

import com.anamensis.server.entity.SystemMessage;
import com.anamensis.server.provider.MailProvider;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class SystemMessageServiceTest {

    @SpyBean
    SystemMessageService sms;

    Logger log = org.slf4j.LoggerFactory.getLogger(SystemMessageServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("아이디로 시스템 메시지 찾기")
    void findById() {
        StepVerifier.create(sms.findById(100))
                .verifyErrorMessage("Not found id: 100");

        StepVerifier.create(sms.findById(1))
                .assertNext(sm -> {
                    assertEquals("001", sm.getWebSysPk());
                    assertEquals("제목1", sm.getSubject());
                })
                .verifyComplete();

        StepVerifier.create(sms.findById(2))
                .assertNext(sm -> {
                    assertEquals("001", sm.getWebSysPk());
                    assertEquals("제목2", sm.getSubject());
                })
                .verifyComplete();

        StepVerifier.create(sms.findById(3))
                .assertNext(sm -> {
                    assertEquals("001", sm.getWebSysPk());
                    assertEquals("제목3", sm.getSubject());
                })
                .verifyComplete();

        StepVerifier.create(sms.findById(4))
                .assertNext(sm -> {
                    assertEquals("002", sm.getWebSysPk());
                    assertEquals("제목4", sm.getSubject());
                })
                .verifyComplete();

        StepVerifier.create(sms.findById(99))
                .verifyErrorMessage("Not found id: 99");

    }

    @Test
    @Order(2)
    @DisplayName("웹시스템 아이디로 시스템 메시지 찾기")
    void findByWebSysPk() {
        StepVerifier.create(sms.findByWebSysPk("005"))
                .assertNext(list -> {
                    assertEquals(0, list.size());
                })
                .verifyComplete();

        StepVerifier.create(sms.findByWebSysPk("001"))
                .assertNext(list -> {
                    assertEquals(3, list.size());
                    assertEquals("제목1", list.get(0).getSubject());
                    assertEquals("제목2", list.get(1).getSubject());
                    assertEquals("제목3", list.get(2).getSubject());
                    list.stream().reduce((acc, next) -> {
                        assertTrue(acc.getId() < next.getId());
                        return next;
                    });
                })
                .verifyComplete();

        StepVerifier.create(sms.findByWebSysPk("002"))
                .assertNext(list -> {
                    assertEquals(1, list.size());
                    assertEquals("제목4", list.get(0).getSubject());
                })
                .verifyComplete();
    }

    @Test
    @Order(3)
    @DisplayName("시스템 메시지 저장")
    void save() {
        SystemMessage sm = new SystemMessage();
        sm.setWebSysPk("003");

        StepVerifier.create(sms.save(sm))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();


        sm.setSubject("제목5");
        StepVerifier.create(sms.save(sm))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();


        sm.setContent("내용5");
        StepVerifier.create(sms.save(sm))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();


        StepVerifier.create(sms.findByWebSysPk("003"))
                .assertNext(sm2 -> {
                    assertEquals(2, sm2.size());
                })
                .verifyComplete();
    }

    @Test
    @Order(4)
    @DisplayName("시스템 메시지 업데이트")
    void update() {
        SystemMessage sm = sms.findById(1).block();
        sm.setSubject(null);
        sm.setContent(null);

        StepVerifier.create(sms.update(sm))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

        sm.setSubject("제목1-1");
        sm.setContent("내용1-1");

        StepVerifier.create(sms.update(sm))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

        StepVerifier.create(sms.findById(1))
                .assertNext(sm2 -> {
                    assertEquals("제목1-1", sm2.getSubject());
                    assertEquals("내용1-1", sm2.getContent());
                    assertEquals("extra1", sm2.getExtra1());
                    assertEquals("extra2", sm2.getExtra2());
                    assertEquals("extra3", sm2.getExtra3());
                    assertEquals("extra4", sm2.getExtra4());
                    assertEquals("extra5", sm2.getExtra5());
                })
                .verifyComplete();

        sm.setExtra1("extra1-1");
        sm.setExtra2("extra2-1");
        sm.setExtra3("extra3-1");
        sm.setExtra4("extra4-1");
        sm.setExtra5("extra5-1");

        StepVerifier.create(sms.update(sm))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

        StepVerifier.create(sms.findById(1))
                .assertNext(sm2 -> {
                    assertEquals("제목1-1", sm2.getSubject());
                    assertEquals("내용1-1", sm2.getContent());
                    assertEquals("extra1-1", sm2.getExtra1());
                    assertEquals("extra2-1", sm2.getExtra2());
                    assertEquals("extra3-1", sm2.getExtra3());
                    assertEquals("extra4-1", sm2.getExtra4());
                    assertEquals("extra5-1", sm2.getExtra5());
                })
                .verifyComplete();
    }

    @Test
    @Order(5)
    @DisplayName("사용여부 업데이트")
    void updateIsUse() {
        StepVerifier.create(sms.findById(1))
                .assertNext(sm -> {
                    assertTrue(sm.isUse());
                })
                .verifyComplete();

        StepVerifier.create(sms.updateIsUse(1, false))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

        StepVerifier.create(sms.findById(1))
                .assertNext(sm -> {
                    assertFalse(sm.isUse());
                })
                .verifyComplete();


        StepVerifier.create(sms.updateIsUse(99, true))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();
    }

    @Test
    @Order(6)
    @DisplayName("시스템 메시지 삭제")
    void delete() {
        StepVerifier.create(sms.findById(1))
                .assertNext(Assertions::assertNotNull)
                .verifyComplete();

        StepVerifier.create(sms.findByWebSysPk("001"))
                .assertNext(list -> {
                    assertEquals(3, list.size());
                })
                .verifyComplete();

        StepVerifier.create(sms.delete(1))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

        StepVerifier.create(sms.findById(1))
                .verifyErrorMessage("Not found id: 1");

        StepVerifier.create(sms.findByWebSysPk("001"))
                .assertNext(list -> {
                    assertEquals(2, list.size());
                })
                .verifyComplete();


        StepVerifier.create(sms.delete(99))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();
    }


}