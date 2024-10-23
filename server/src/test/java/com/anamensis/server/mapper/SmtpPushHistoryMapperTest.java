package com.anamensis.server.mapper;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class SmtpPushHistoryMapperTest {

    @SpyBean
    SmtpPushHistoryMapper spm;

    @Test
    @Disabled
    void countByMemberPk() {
    }

// 회원별 smtp push 기능 없어짐
//    @Test
//    @Order(1)
//    @DisplayName("회원별 히스토리 조회")
//    void findByMemberPk() {
//        Page page = new Page();
//        page.setPage(1);
//        page.setSize(6);
//        List<SmtpPushHistory> list = spm.findByMemberPk(1, page);
//        assertFalse(list.isEmpty());
//        assertEquals(6, list.size());
//
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 10));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 9));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 8));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 7));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 6));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 5));
//        assertFalse(list.stream().anyMatch(sph -> sph.getId() == 4));
//
//        list.stream().reduce((sph1, sph2) -> {
//            assertTrue(sph1.getId() > sph2.getId());
//            return sph2;
//        });
//
//        page.setPage(2);
//        list = spm.findByMemberPk(1, page);
//        assertFalse(list.isEmpty());
//        assertEquals(4, list.size());
//
//        assertFalse(list.stream().anyMatch(sph -> sph.getId() == 5));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 4));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 3));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 2));
//        assertTrue(list.stream().anyMatch(sph -> sph.getId() == 1));
//        assertFalse(list.stream().anyMatch(sph -> sph.getId() == 0));
//
//        list.stream().reduce((sph1, sph2) -> {
//            assertTrue(sph1.getId() > sph2.getId());
//            return sph2;
//        });
//    }

    @Test
    @Order(2)
    @DisplayName("id 조회")
    void findById() {
        assertTrue(spm.findById(1).isPresent());
        assertTrue(spm.findById(2).isPresent());
        assertTrue(spm.findById(3).isPresent());
        assertTrue(spm.findById(4).isPresent());
        assertTrue(spm.findById(5).isPresent());
        assertTrue(spm.findById(6).isPresent());
        assertTrue(spm.findById(7).isPresent());
        assertTrue(spm.findById(8).isPresent());
        assertTrue(spm.findById(9).isPresent());
        assertTrue(spm.findById(10).isPresent());
        assertFalse(spm.findById(11).isPresent());
        assertFalse(spm.findById(0).isPresent());
    }


}