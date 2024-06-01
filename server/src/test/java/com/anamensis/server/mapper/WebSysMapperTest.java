package com.anamensis.server.mapper;

import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class WebSysMapperTest {


    @SpyBean
    MemberConfigSmtpMapper userConfigSmtpMapper;

    @SpyBean
    BCryptPasswordEncoder encoder;

    @SpyBean
    MemberMapper memberMapper;

    @BeforeAll
    public void setUp() {
        Member member1 = new Member();
        member1.setUserId("wsmt1");
        member1.setPwd(encoder.encode("wsmt1"));
        member1.setName("wsmt1");
        member1.setEmail("wsmt1@gmail.com");
        member1.setPhone("010-1111-4001");
        member1.setUse(true);
        member1.setCreateAt(LocalDateTime.now());
        memberMapper.save(member1);



    }

    @SpyBean
    WebSysMapper webSysMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(WebSysMapperTest.class);

    @Test
    @Order(1)
    @DisplayName("저장")
    void save() {
        WebSys webSys = new WebSys();
        webSys.setCode("005");
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                webSysMapper.save(webSys)
        );

        webSys.setName("name");
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                webSysMapper.save(webSys)
        );

        webSys.setPermission(RoleType.ADMIN);
        assertDoesNotThrow(() ->
                webSysMapper.save(webSys)
        );

        webSys.setCode("002");
        assertThrowsExactly(DuplicateKeyException.class, () ->
                webSysMapper.save(webSys)
        );

        webSys.setDescription("description");
        assertThrowsExactly(DuplicateKeyException.class, () ->
                webSysMapper.save(webSys)
        );

        webSys.setCode("006");
        assertDoesNotThrow(() -> webSysMapper.save(webSys));

        // code 4자 제한
        webSys.setCode("00500");
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                webSysMapper.save(webSys)
        );

        webSys.setCode("007");
        webSys.setName("a".repeat(101));
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                webSysMapper.save(webSys)
        );

        webSys.setName("a".repeat(100));
        assertDoesNotThrow(() -> webSysMapper.save(webSys));

        webSys.setCode("008");
        webSys.setDescription("a".repeat(65535));
        assertDoesNotThrow(() -> webSysMapper.save(webSys));
    }

    @Test
    @Order(2)
    @DisplayName("리스트 저장")
    void saveAll() {
        List<WebSys> list1 = IntStream.range(0, 2).mapToObj(i ->
            new WebSys() {{
                setCode("011");
                setName("name" + i);
                setDescription("description" + i);
                setPermission(RoleType.values()[(int) (Math.random() * RoleType.values().length)]);
            }}
        ).collect(Collectors.toList());

        assertThrowsExactly(DuplicateKeyException.class, () ->
                webSysMapper.saveAll(list1)
        );

        List<WebSys> list2 = IntStream.range(0, 2).mapToObj(i ->
            new WebSys() {{
                setCode("01" + i);
                setName("name" + i);
                setDescription("description" + i);
                setPermission(RoleType.values()[(int) (Math.random() * RoleType.values().length)]);
            }}
        ).collect(Collectors.toList());

        assertDoesNotThrow(() -> webSysMapper.saveAll(list2));
    }


    @Test
    @Order(3)
    @DisplayName("전체 조회")
    void findAll() {
        WebSys webSys = new WebSys();
        RoleType randomRole = RoleType.values()[(int) (Math.random() * RoleType.values().length)];
        webSys.setCode("021");
        webSys.setName("name");
        webSys.setDescription("description");
        webSys.setPermission(randomRole);
        webSysMapper.save(webSys);

        List<WebSys> list = webSysMapper.findAll();
        assertTrue(list.size() > 1);

        assertFalse(list.stream().anyMatch(ws -> ws.getCode().equals("100")));

        assertTrue(list.stream().anyMatch(ws -> ws.getCode().equals(webSys.getCode())));
        assertTrue(list.stream().anyMatch(ws -> ws.getName().equals(webSys.getName())));
        assertTrue(list.stream().anyMatch(ws -> ws.getDescription().equals(webSys.getDescription())));
        assertTrue(list.stream().anyMatch(ws -> ws.getPermission().equals(webSys.getPermission())));

    }

    @Test
    @Order(4)
    @DisplayName("코드로 조회")
    void findByCode() {

        WebSys webSys = new WebSys();
        RoleType randomRole = RoleType.values()[(int) (Math.random() * RoleType.values().length)];
        webSys.setCode("031");
        webSys.setName("name");
        webSys.setDescription("description");
        webSys.setPermission(randomRole);
        webSysMapper.save(webSys);


        assertFalse(webSysMapper.findByCode("100").isPresent());
        assertThrowsExactly(NoSuchElementException.class, () ->
                webSysMapper.findByCode("100").get()
        );

        assertThrowsExactly(RuntimeException.class, () ->
                webSysMapper.findByCode("100").orElseThrow(
                        () -> new RuntimeException("Not found")
        ));

        assertTrue(webSysMapper.findByCode("002").isPresent());
        assertDoesNotThrow(() -> webSysMapper.findByCode("002").get());

        assertTrue(webSysMapper.findByCode("031").isPresent());
        assertDoesNotThrow(() -> webSysMapper.findByCode("031").get());

        WebSys webSys1 = webSysMapper.findByCode("031").get();
        assertEquals(webSys.getCode(), webSys1.getCode());
        assertEquals(webSys.getName(), webSys1.getName());
        assertEquals(webSys.getDescription(), webSys1.getDescription());
        assertEquals(webSys.getPermission(), webSys1.getPermission());

    }

    @Test
    @Order(5)
    @DisplayName("권한으로 조회")
    void findByPermission() {
        WebSys webSys = new WebSys();
        webSys.setCode("041");
        webSys.setName("name");
        webSys.setDescription("description");
        webSys.setPermission(RoleType.USER);
        webSysMapper.save(webSys);

        webSys.setCode("042");
        webSys.setPermission(RoleType.ADMIN);
        webSysMapper.save(webSys);

        webSys.setCode("043");
        webSys.setPermission(RoleType.MASTER);
        webSysMapper.save(webSys);

        webSys.setCode("044");
        webSys.setPermission(RoleType.GUEST);
        webSysMapper.save(webSys);

        List<WebSys> userList = webSysMapper.findByPermission(RoleType.USER);
        List<WebSys> adminList = webSysMapper.findByPermission(RoleType.ADMIN);
        List<WebSys> masterList = webSysMapper.findByPermission(RoleType.MASTER);
        List<WebSys> guestList = webSysMapper.findByPermission(RoleType.GUEST);

        assertTrue(userList.size() > 0);
        assertTrue(adminList.size() > 0);
        assertTrue(masterList.size() > 0);
        assertTrue(guestList.size() > 0);

        userList.forEach(ws -> assertEquals(RoleType.USER, ws.getPermission()));
        adminList.forEach(ws -> assertEquals(RoleType.ADMIN, ws.getPermission()));
        masterList.forEach(ws -> assertEquals(RoleType.MASTER, ws.getPermission()));
        guestList.forEach(ws -> assertEquals(RoleType.GUEST, ws.getPermission()));
    }

    @Test
    @Order(6)
    @DisplayName("수정")
    void update() {
        WebSys webSys = new WebSys();
        webSys.setCode("051");
        webSys.setName("name");
        webSys.setDescription("description");
        webSys.setPermission(RoleType.USER);
        webSysMapper.save(webSys);

        WebSys webSys1 = webSysMapper.findByCode("051").get();
        webSys1.setName("name1");
        assertEquals(1, webSysMapper.update(webSys1));
        webSysMapper.findByCode("051").ifPresentOrElse(
                ws -> assertEquals("name1", ws.getName()),
                () -> fail("Not found")
        );

        webSys1.setDescription("description1");
        assertEquals(1, webSysMapper.update(webSys1));
        webSysMapper.findByCode("051").ifPresentOrElse(
                ws -> assertEquals("description1", ws.getDescription()),
                () -> fail("Not found")
        );

        webSys1.setPermission(RoleType.ADMIN);
        assertEquals(1, webSysMapper.update(webSys1));
        webSysMapper.findByCode("051").ifPresentOrElse(
                ws -> assertEquals(RoleType.ADMIN, ws.getPermission()),
                () -> fail("Not found")
        );
    }

    @Test
    @Order(7)
    @DisplayName("삭제")
    void deleteByCode() {
        WebSys webSys = new WebSys();
        webSys.setCode("061");
        webSys.setName("name");
        webSys.setDescription("description");
        webSys.setPermission(RoleType.USER);
        webSysMapper.save(webSys);

        assertEquals(0, webSysMapper.deleteByCode("999"));
        assertTrue(webSysMapper.findByCode("061").isPresent());
        assertEquals(1,webSysMapper.deleteByCode("061"));
        assertEquals(0,webSysMapper.deleteByCode("061"));
        assertFalse(webSysMapper.findByCode("061").isPresent());
    }

    @Test
    @Order(8)
    @DisplayName("save - name 100자 제한 테스트")
    void name() {
        WebSys webSysbase = new WebSys();
        webSysbase.setName("a".repeat(100));
        webSysbase.setCode("1001");
        webSysbase.setPermission(RoleType.USER);
        assertDoesNotThrow(() -> webSysMapper.save(webSysbase));

        webSysbase.setCode("1002");
        webSysbase.setName("b".repeat(101));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> webSysMapper.save(webSysbase));
    }


}