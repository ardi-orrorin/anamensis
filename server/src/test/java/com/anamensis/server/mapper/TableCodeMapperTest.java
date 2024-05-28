package com.anamensis.server.mapper;

import com.anamensis.server.entity.TableCode;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.test.context.ActiveProfiles;

import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class TableCodeMapperTest {

    @SpyBean
    TableCodeMapper tableCodeMapper;

    TableCode tableCode = new TableCode();

    @BeforeAll
    void setUp() {
        tableCode.setTableName("table");
        tableCode.setUse(true);
        tableCodeMapper.save(tableCode);
    }

    @Test
    @Order(1)
    @DisplayName("저장")
    void save() {
        TableCode tableCode1 = new TableCode();
        tableCode1.setTableName("table1");

        assertDoesNotThrow(() -> tableCodeMapper.save(tableCode1));

        tableCode1.setUse(true);
        assertThrowsExactly(DuplicateKeyException.class, () -> tableCodeMapper.save(tableCode1));

        tableCode1.setTableName("table2");
        assertDoesNotThrow(() -> tableCodeMapper.save(tableCode1));

    }

    @Test
    @Order(2)
    @DisplayName("조회")
    void findByIdByTableName() {
        TableCode tableCode1 = new TableCode();
        tableCode1.setTableName("table3");
        tableCode1.setUse(true);
        tableCodeMapper.save(tableCode1);


        assertFalse(tableCodeMapper.findByIdByTableName(0, "table10").isPresent());
        assertThrowsExactly(NoSuchElementException.class, () ->
                tableCodeMapper.findByIdByTableName(0, "table10").get()
        );

        assertTrue(tableCodeMapper.findByIdByTableName(0, "table3").isPresent());
        assertDoesNotThrow(() -> tableCodeMapper.findByIdByTableName(0, "table3").get());
        TableCode tableCode2 = tableCodeMapper.findByIdByTableName(0, "table3").get();
        assertEquals(tableCode1.getTableName(), tableCode2.getTableName());
        assertEquals(tableCode1.isUse(), tableCode2.isUse());


        assertFalse(tableCodeMapper.findByIdByTableName(100, null).isPresent());
        assertThrowsExactly(NoSuchElementException.class, () ->
                tableCodeMapper.findByIdByTableName(100, null).get()
        );

        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());
        assertDoesNotThrow(() -> tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).get());
        TableCode tableCode3 = tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).get();
        assertEquals(tableCode1.getTableName(), tableCode3.getTableName());
        assertEquals(tableCode1.isUse(), tableCode3.isUse());

        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());
        assertDoesNotThrow(() -> tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").get());
        TableCode tableCode4 = tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").get();
        assertEquals(tableCode1.getTableName(), tableCode4.getTableName());
        assertEquals(tableCode1.isUse(), tableCode4.isUse());
    }


    @Test
    @Order(3)
    @DisplayName("수정")
    void update() {
        TableCode tableCode1 = new TableCode();
        tableCode1.setTableName("table4");
        tableCode1.setUse(true);
        tableCodeMapper.save(tableCode1);

        TableCode tableCode2 = tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").get();

        tableCode2.setTableName("table5");
        assertEquals(1, tableCodeMapper.update(tableCode2));
        tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").ifPresent(tableCode3 -> {
            assertEquals(tableCode2.getTableName(), tableCode3.getTableName());
            assertNotEquals(tableCode1.getTableName(), tableCode3.getTableName());
            assertEquals(tableCode2.isUse(), tableCode3.isUse());
        });

        tableCode2.setUse(false);
        assertEquals(1, tableCodeMapper.update(tableCode2));
        tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").ifPresent(tableCode3 -> {
            assertEquals(tableCode2.getTableName(), tableCode3.getTableName());
            assertEquals(tableCode2.isUse(), tableCode3.isUse());
            assertNotEquals(tableCode1.isUse(), tableCode3.isUse());
        });

        tableCode2.setId(999);
        assertEquals(0, tableCodeMapper.update(tableCode2));
        tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").ifPresent(tableCode3 -> {
            assertEquals(tableCode2.getTableName(), tableCode3.getTableName());
            assertEquals(tableCode2.isUse(), tableCode3.isUse());
        });
    }

    @Test
    @Order(4)
    @DisplayName("삭제")
    void deleteByIdOrTableName() {
        TableCode tableCode1 = new TableCode();
        tableCode1.setTableName("table6");
        tableCode1.setUse(true);
        tableCodeMapper.save(tableCode1);

        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());
        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());
        assertTrue(tableCodeMapper.findByIdByTableName(0, tableCode1.getTableName()).isPresent());

        assertEquals(1, tableCodeMapper.deleteByIdOrTableName(tableCode1.getId(), null));

        assertFalse(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());
        assertFalse(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());
        assertFalse(tableCodeMapper.findByIdByTableName(0, tableCode1.getTableName()).isPresent());

        tableCodeMapper.save(tableCode1);

        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());
        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());
        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());

        assertEquals(1, tableCodeMapper.deleteByIdOrTableName(tableCode1.getId(), null));

        assertFalse(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());
        assertFalse(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());
        assertFalse(tableCodeMapper.findByIdByTableName(0, tableCode1.getTableName()).isPresent());


        tableCodeMapper.save(tableCode1);

        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());
        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());
        assertTrue(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());

        assertEquals(1, tableCodeMapper.deleteByIdOrTableName(tableCode1.getId(), null));

        assertFalse(tableCodeMapper.findByIdByTableName(tableCode1.getId(), null).isPresent());
        assertFalse(tableCodeMapper.findByIdByTableName(tableCode1.getId(), "").isPresent());
        assertFalse(tableCodeMapper.findByIdByTableName(0, tableCode1.getTableName()).isPresent());
    }

    @Test
    @Order(5)
    @DisplayName("save - tableName 255자 제한 테스트")
    void saveTableName255() {
        TableCode tableCode1 = new TableCode();
        tableCode1.setTableName("a".repeat(255));

        assertDoesNotThrow(() -> tableCodeMapper.save(tableCode1));

        tableCode1.setTableName("b".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                tableCodeMapper.save(tableCode1)
        );
    }


}