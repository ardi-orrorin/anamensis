package com.anamensis.server.mapper;

import com.anamensis.server.entity.Attendance;
import com.anamensis.server.entity.Member;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class AttendanceMapperTest {

    @SpyBean
    private AttendanceMapper attendanceMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(AttendanceMapperTest.class);


    @SpyBean
    BCryptPasswordEncoder encoder;

    @SpyBean
    MemberMapper memberMapper;

    @BeforeAll
    public void setUp() {
        Member member1 = new Member();
        Member member2 = new Member();
        member1.setUserId("atmt1");
        member1.setPwd(encoder.encode("atmt1"));
        member1.setName("atmt1");
        member1.setEmail("atmt1@gmail.com");
        member1.setPhone("010-1111-5001");
        member1.setUse(true);
        member1.setCreateAt(LocalDateTime.now());
        memberMapper.save(member1);

        member2.setUserId("atmt2");
        member2.setPwd(encoder.encode("atmt2"));
        member2.setName("atmt2");
        member2.setEmail("atmt2@gmail.com");
        member2.setPhone("010-1111-5002");
        member2.setUse(true);
        member2.setCreateAt(LocalDateTime.now());
        memberMapper.save(member2);

        attendanceMapper.init(member2.getId(), LocalDate.now());

    }


    @Test
    @Order(1)
    @DisplayName("출석체크 초기화")
    void init() {
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            attendanceMapper.init(99, LocalDate.now());
        });

        Member member3 = new Member();
        member3.setUserId("atmt3");
        member3.setPwd(encoder.encode("atmt3"));
        member3.setName("atmt3");
        member3.setEmail("atmt3@gmail.com");
        member3.setPhone("010-1111-5003");
        member3.setUse(true);
        member3.setCreateAt(LocalDateTime.now());
        memberMapper.save(member3);



        Member member = memberMapper.findMemberByUserId("atmt3")
                        .orElseThrow(() -> new RuntimeException("Member not found"));

        assertDoesNotThrow(()->
            attendanceMapper.init(member.getId(), LocalDate.now())
        );
    }

    @Test
    @Order(2)
    @DisplayName("출석체크 조회")
    void findByUserPk() {

        assertFalse(attendanceMapper.findByMemberPk(99).isPresent());
        assertThrowsExactly(NoSuchElementException.class, () -> {
            attendanceMapper.findByMemberPk(99).get();
        });

        Member member1 = memberMapper.findMemberByUserId("atmt1")
                        .orElseThrow(() -> new RuntimeException("Member not found"));
        assertFalse(attendanceMapper.findByMemberPk(member1.getId()).isPresent());

        assertThrowsExactly(NoSuchElementException.class, () -> {
            attendanceMapper.findByMemberPk(member1.getId()).get();
        });


        Member member2 = memberMapper.findMemberByUserId("atmt2")
                .orElseThrow(() -> new RuntimeException("Member not found"));

        assertTrue(attendanceMapper.findByMemberPk(member2.getId()).isPresent());
        assertDoesNotThrow(() -> {
            attendanceMapper.findByMemberPk(member2.getId()).get();
        });
    }

    @Test
    @Order(3)
    @DisplayName("출석체크 업데이트")
    @Disabled("테스트 불가")
    void update() {
        Member member2 = memberMapper.findMemberByUserId("atmt2")
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Attendance attendance = new Attendance();
        attendance.setMemberPk(member2.getId());
        attendance.setLastDate(LocalDate.now());
        attendance.setDays(1);
        attendance.setUse(true);

        assertDoesNotThrow(() -> {
            attendanceMapper.update(attendance);
        });
    }


}