package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.PointHistoryRequest;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.PointCode;
import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.entity.TableCode;
import com.anamensis.server.resultMap.PointHistoryResultMap;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class PointHistoryMapperTest {

    @SpyBean
    PointHistoryMapper pointHistoryMapper;

    @SpyBean
    MemberMapper memberMapper;

    @SpyBean
    TableCodeMapper tableCodeMapper;

    @SpyBean
    PointCodeMapper pointCodeMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(MemberMapperTest.class);

    @Test
    @Order(1)
    @DisplayName("insert 테스트")
    void insert() {
        Member member = memberMapper.findMemberByUserId("d-member-1").orElseThrow();
        TableCode tableCode = tableCodeMapper.findByIdByTableName(0, "member").orElseThrow();
        PointCode pointCode = pointCodeMapper.selectByIdOrName(0, "attend-1").orElseThrow();

        PointHistory ph = new PointHistory();
        ph.setMemberPk(member.getId());
        ph.setTableCodePk(tableCode.getId());
        ph.setTableRefPk(member.getId());
        ph.setPointCodePk(pointCode.getId());
        ph.setCreateAt(LocalDateTime.now());

        assertEquals(1, pointHistoryMapper.insert(ph));
    }

    @Test
    @Order(2)
    @DisplayName("포인트 제약조건 테스트")
    void integrity(){
        Member member = memberMapper.findMemberByUserId("d-member-1").orElseThrow();
        TableCode tableCode = tableCodeMapper.findByIdByTableName(0, "member").orElseThrow();
        PointCode pointCode = pointCodeMapper.selectByIdOrName(0, "attend-1").orElseThrow();

        PointHistory ph = new PointHistory();

        ph.setMemberPk(member.getId());
        ph.setTableCodePk(tableCode.getId());
        ph.setTableRefPk(member.getId());
        ph.setPointCodePk(pointCode.getId());
        ph.setCreateAt(LocalDateTime.now());

        assertEquals(1, pointHistoryMapper.insert(ph));

        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            ph.setMemberPk(99);
            pointHistoryMapper.insert(ph);
        });
        ph.setMemberPk(member.getId());

        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            ph.setTableCodePk(99);
            pointHistoryMapper.insert(ph);
        });
        ph.setTableCodePk(tableCode.getId());

        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            ph.setPointCodePk(99);
            pointHistoryMapper.insert(ph);
        });
        ph.setPointCodePk(pointCode.getId());
    }

    @Test
    @Order(3)
    @DisplayName("포인트 히스토리 테스트")
    void selectByPointHistory() {
        Page page = new Page();
        PointHistoryRequest.Param param = new PointHistoryRequest.Param();
        page.setPage(1);
        page.setSize(10);


        param.setPointCodeName("attend-1");
        List<PointHistoryResultMap> list = pointHistoryMapper.selectByPointHistory(page, param,1);
        assertEquals(1, list.size());

        param.setPointCodeName(null);
        param.setTableName("board");
        list = pointHistoryMapper.selectByPointHistory(page, param, 1);
        assertEquals(3, list.size());

        param.setTableName(null);
        list = pointHistoryMapper.selectByPointHistory(page, param, 1);
        assertEquals(3, list.size());

        list = pointHistoryMapper.selectByPointHistory(page, param, 0);
        assertEquals(6, list.size());

        page.setPage(1);
        page.setSize(4);
        list = pointHistoryMapper.selectByPointHistory(page, param, 0);
        assertEquals(4, list.size());

        assertTrue(list.stream().anyMatch(p -> p.getId() == 6));
        assertTrue(list.stream().anyMatch(p -> p.getId() == 5));
        assertTrue(list.stream().anyMatch(p -> p.getId() == 4));
        assertTrue(list.stream().anyMatch(p -> p.getId() == 3));
        assertFalse(list.stream().anyMatch(p -> p.getId() == 2));

        page.setPage(2);
        list = pointHistoryMapper.selectByPointHistory(page, param, 0);
        assertNotEquals(4, list.size());
        assertEquals(2, list.size());
        assertFalse(list.stream().anyMatch(p -> p.getId() == 3));
        assertTrue(list.stream().anyMatch(p -> p.getId() == 2));
        assertTrue(list.stream().anyMatch(p -> p.getId() == 1));
        assertFalse(list.stream().anyMatch(p -> p.getId() == 0));
    }

    @Test
    @DisplayName("포인트 히스토리 카운트 테스트")
    @Order(4)
    void count() {

        PointHistoryRequest.Param param = new PointHistoryRequest.Param();

        int count = pointHistoryMapper.count(param,0);
        assertEquals(6, count);

        param.setPointCodeName("attend-1");
        count = pointHistoryMapper.count(param,0);
        assertEquals(1, count);

        param.setPointCodeName(null);
        param.setTableName("board");
        count = pointHistoryMapper.count(param, 0);
        assertEquals(3, count);

        param.setTableName(null);
        count = pointHistoryMapper.count(param, 2);
        assertEquals(2, count);

        count = pointHistoryMapper.count(param, 0);
        assertEquals(6, count);

    }
}