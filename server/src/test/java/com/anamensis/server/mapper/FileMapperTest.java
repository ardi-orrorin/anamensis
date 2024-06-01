package com.anamensis.server.mapper;

import com.anamensis.server.entity.File;
import com.anamensis.server.entity.TableCode;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
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
class FileMapperTest {

    @SpyBean
    FileMapper fileMapper;

    @SpyBean
    TableCodeMapper tableCodeMapper;

    TableCode tableCode = new TableCode();

    File file = new File();

    @BeforeAll
    public void setUp() {
        tableCode.setTableName("file-board");
        tableCode.setUse(true);
        tableCodeMapper.save(tableCode);

        file.setTableCodePk(tableCode.getId());
        file.setTableRefPk(12);
        file.setOrgFileName("orgFileName100.txt");
        file.setFileName("uuidFileName100.txt");
        file.setFilePath("/20240601/100/");
        file.setCreateAt(LocalDateTime.now());
        file.setUse(true);
        fileMapper.insert(file);
    }

    @Test
    @Order(1)
    @DisplayName("파일을 추가")
    void insert() {
        File file = new File();

        file.setOrgFileName("orgFileName.txt");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            fileMapper.insert(file);
        });

        file.setFileName("uuidFileName.txt");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            fileMapper.insert(file);
        });

        file.setFilePath("/20240601/");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            fileMapper.insert(file);
        });

        file.setCreateAt(LocalDateTime.now());
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            fileMapper.insert(file);
        });

        file.setTableCodePk(tableCode.getId());
        assertDoesNotThrow(() -> fileMapper.insert(file));

        // fileName + filePath unique 테스트
        file.setTableRefPk(1);
        assertThrowsExactly(DuplicateKeyException.class, () -> fileMapper.insert(file));
    }

    @Test
    @Order(1)
    @DisplayName("save - orgFileName 255자 제한 테스트")
    void orgFileName() {
        file.setOrgFileName("a".repeat(255));
        assertDoesNotThrow(() -> {
            file.setFilePath("/20240601/101"); //  테스트를 위해 unique 무결성 filePath 변경
            fileMapper.insert(file);
        });

        file.setOrgFileName("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            file.setFilePath("/20240601/102"); //  테스트를 위해 unique 무결성 filePath 변경
            fileMapper.insert(file);
        });

        file.setOrgFileName("orgFileName100.txt");
        assertDoesNotThrow(() -> {
            file.setFilePath("/20240601/103"); //  테스트를 위해 unique 무결성 filePath 변경
            fileMapper.insert(file);
        });
    }

    @Test
    @Order(1)
    @DisplayName("save - filePath 255자 제한 테스트")
    void filePath() {
        file.setFilePath("a".repeat(255));
        assertDoesNotThrow(() -> {
            file.setFileName("orgFileName101.txt"); //  테스트를 위해 unique 무결성 orgFileName 변경
            fileMapper.insert(file);
        });

        file.setFilePath("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            file.setFileName("orgFileName102.txt"); //  테스트를 위해 unique 무결성 orgFileName 변경
            fileMapper.insert(file);
        });

        file.setFilePath("/20240601/100/");
        assertDoesNotThrow(() -> {
            file.setFileName("orgFileName103.txt"); //  테스트를 위해 unique 무결성 orgFileName 변경
            fileMapper.insert(file);
        });
    }

    @Test
    @Order(1)
    @DisplayName("save - fileName 255자 제한 테스트")
    void fileName() {
        file.setFileName("a".repeat(255));
        assertDoesNotThrow(() -> {
            file.setFilePath("/20240601/200/"); //  테스트를 위해 unique 무결성 orgFileName 변경
            fileMapper.insert(file);
        });

        file.setFileName("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            file.setFilePath("/20240601/201/"); //  테스트를 위해 unique 무결성 orgFileName 변경
            fileMapper.insert(file);
        });

        file.setFileName("uuidFileName100.txt");
        assertDoesNotThrow(() -> {
            file.setFilePath("/20240601/202/"); //  테스트를 위해 unique 무결성 orgFileName 변경
            fileMapper.insert(file);
        });
    }


    @Test
    @Order(2)
    @DisplayName("파일명으로 조회")
    void selectByFileName() {
        File file1 = new File();
        file1.setTableCodePk(tableCode.getId());
        file1.setTableRefPk(1);
        file1.setOrgFileName("orgFileName1.txt");
        file1.setFileName("uuidFileName1.txt");
        file1.setFilePath("/20240602/");
        file1.setCreateAt(LocalDateTime.now());
        file1.setUse(true);
        fileMapper.insert(file1);

        assertFalse(fileMapper.selectByFileName("orgFileName1.txt").isPresent());

        assertTrue(fileMapper.selectByFileName("uuidFileName1.txt").isPresent());
        assertDoesNotThrow(() -> fileMapper.selectByFileName("uuidFileName1.txt").get());

        File file2 = fileMapper.selectByFileName("uuidFileName1.txt").get();
        assertEquals(file1.getId(), file2.getId());
        assertEquals(file1.getTableCodePk(), file2.getTableCodePk());
        assertEquals(file1.getTableRefPk(), file2.getTableRefPk());
        assertEquals(file1.getOrgFileName(), file2.getOrgFileName());
        assertEquals(file1.getFileName(), file2.getFileName());
        assertEquals(file1.getFilePath(), file2.getFilePath());
        assertEquals(file1.getCreateAt(), file2.getCreateAt());
        assertEquals(file1.isUse(), file2.isUse());
    }

    @Test
    @Order(3)
    @DisplayName("File 사용 여부 수정")
    void updateIsUseById() {
        File file1 = new File();
        file1.setTableCodePk(tableCode.getId());
        file1.setTableRefPk(1);
        file1.setOrgFileName("orgFileName4.txt");
        file1.setFileName("uuidFileName4.txt");
        file1.setFilePath("/20240604/");
        file1.setCreateAt(LocalDateTime.now());
        file1.setUse(true);
        fileMapper.insert(file1);

        assertTrue(fileMapper.selectByFileName("uuidFileName4.txt").isPresent());

        assertEquals(1, fileMapper.updateIsUseById(file1.getId(), 0));
        assertFalse(fileMapper.selectByFileName("uuidFileName4.txt").isPresent());

        assertEquals(1, fileMapper.updateIsUseById(file1.getId(), 1));
        assertTrue(fileMapper.selectByFileName("uuidFileName4.txt").isPresent());
    }

    @Test
    @Order(4)
    @DisplayName("테이블과 참조키로 조회")
    void findByTableNameAndTableRefPk() {
        File file1 = new File();
        file1.setTableCodePk(tableCode.getId());
        file1.setTableRefPk(100);
        file1.setOrgFileName("orgFileName5.txt");
        file1.setFileName("uuidFileName5.txt");
        file1.setFilePath("/20240605/");
        file1.setCreateAt(LocalDateTime.now());
        file1.setUse(true);
        fileMapper.insert(file1);

        File file2 = new File();
        file2.setTableCodePk(tableCode.getId());
        file2.setTableRefPk(99);
        file2.setOrgFileName("orgFileName6.txt");
        file2.setFileName("uuidFileName6.txt");
        file2.setFilePath("/20240606/");
        file2.setCreateAt(LocalDateTime.now());
        file2.setUse(true);
        fileMapper.insert(file2);

        File file3 = new File();
        file3.setTableCodePk(tableCode.getId());
        file3.setTableRefPk(99);
        file3.setOrgFileName("orgFileName7.txt");
        file3.setFileName("uuidFileName7.txt");
        file3.setFilePath("/20240607/");
        file3.setCreateAt(LocalDateTime.now());
        file3.setUse(true);
        fileMapper.insert(file3);

        List<File> list = fileMapper.findByTableNameAndTableRefPk(tableCode.getTableName(), 99);

        assertEquals(2, list.size());
        assertTrue(list.stream().anyMatch(file -> file.getId() == file2.getId()));
        assertTrue(list.stream().anyMatch(file -> file.getId() == file3.getId()));

        list = fileMapper.findByTableNameAndTableRefPk(tableCode.getTableName(), 100);

        assertEquals(1, list.size());
        assertTrue(list.stream().anyMatch(file -> file.getId() == file1.getId()));
    }


}