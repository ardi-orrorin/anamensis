package com.anamensis.server.mapper;

import com.anamensis.server.entity.PointCode;
import com.anamensis.server.mapper.PointCodeMapper;
import org.junit.jupiter.api.*;
import org.mybatis.spring.MyBatisSystemException;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PointCodeMapperTest {

    @SpyBean
    PointCodeMapper pointCodeMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(PointCodeMapperTest.class);

    PointCode pointCode = new PointCode();

    @BeforeAll
    public void setUp() {
        pointCode.setName("test");
        pointCode.setPoint(10000);
        pointCodeMapper.insert(pointCode);
    }


    @Test
    @Order(1)
    @DisplayName("포인트 코드를 추가")
    void insert() {
        PointCode pointCode1 = new PointCode();
        pointCode1.setName("""
            255자 제한 테스트
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
            slfijsdlifjsdlivjlsdjvlisdjvlsdijvslijdlsivjlsidjvlsijm/xlckmvisjo;dijf;wijer
        """);

        assertThrowsExactly(DataIntegrityViolationException.class, () ->
            pointCodeMapper.insert(pointCode1)
        );

        pointCode1.setName("point-1");
        pointCode1.setPoint(10);

        assertEquals(1, pointCodeMapper.insert(pointCode1));

    }

    @Test
    @Order(2)
    @DisplayName("포인트 코드를 전체 조회")
    void selectAll() {
        PointCode pointCode1 = new PointCode();
        pointCode1.setName("point-1");
        pointCode1.setPoint(10);

        assertEquals(1, pointCodeMapper.insert(pointCode1));

        List<PointCode> list = pointCodeMapper.selectAll();
        assertTrue(list.size() > 1);
        assertTrue(list.stream().anyMatch(p -> p.getName().equals(pointCode.getName())));
        assertTrue(list.stream().anyMatch(p -> p.getName().equals(pointCode1.getName())));
    }

    @Test
    @Order(3)
    @DisplayName("포인트 코드를 이름 또는 아이디로 조회")
    void selectByIdOrName() {
        PointCode pointCode1 = new PointCode();
        pointCode1.setName("point-1");
        pointCode1.setPoint(10);

        assertEquals(1, pointCodeMapper.insert(pointCode1));

        PointCode pointCode2 = new PointCode();
        pointCode2.setName("point-2");
        pointCode2.setPoint(20);

        assertEquals(1, pointCodeMapper.insert(pointCode2));

        PointCode pointCode3 = new PointCode();
        pointCode3.setName("point-3");
        pointCode3.setPoint(30);

        assertEquals(1, pointCodeMapper.insert(pointCode3));

        assertFalse(pointCodeMapper.selectByIdOrName(99, null).isPresent());
        assertFalse(pointCodeMapper.selectByIdOrName(0, "point-99").isPresent());
        assertThrowsExactly(MyBatisSystemException.class, () ->
                pointCodeMapper.selectByIdOrName(0, null)
        );

        assertTrue(pointCodeMapper.selectByIdOrName(pointCode1.getId(), null).isPresent());
        assertTrue(pointCodeMapper.selectByIdOrName(0, pointCode2.getName()).isPresent());
        assertTrue(pointCodeMapper.selectByIdOrName(pointCode3.getId(), null).isPresent());
    }

    @Test
    @Order(4)
    @DisplayName("포인트 코드 수정")
    void update() {
        PointCode pointCode1 = new PointCode();
        pointCode1.setName("point-11");
        pointCode1.setPoint(10);

        assertEquals(1, pointCodeMapper.insert(pointCode1));

        pointCode1.setPoint(20);
        assertEquals(1, pointCodeMapper.update(pointCode1));

        pointCodeMapper.selectByIdOrName(pointCode1.getId(), null).ifPresent(p -> {
            assertEquals(pointCode1.getPoint(), p.getPoint());
            assertNotEquals(10, pointCode.getPoint());
        });

        pointCode1.setName("point-12");
        assertEquals(1, pointCodeMapper.update(pointCode1));
        pointCodeMapper.selectByIdOrName(pointCode1.getId(), null).ifPresent(p -> {
            assertEquals(pointCode1.getName(), p.getName());
            assertNotEquals("point-11", pointCode.getName());
        });

    }
}