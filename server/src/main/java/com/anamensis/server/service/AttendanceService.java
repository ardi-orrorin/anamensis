package com.anamensis.server.service;

import com.anamensis.server.dto.response.AttendResponse;
import com.anamensis.server.entity.Attendance;
import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.entity.Member;
import com.anamensis.server.mapper.AttendanceMapper;
import com.anamensis.server.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    private final MemberMapper memberMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    public Mono<Attendance> findByMemberPk(long memberPk) {
        Optional<Attendance> attend =  attendanceMapper.findByMemberPk(memberPk);
        if(attend.isEmpty()) {
            attendanceMapper.init(memberPk, LocalDate.now()) ;
            attend = attendanceMapper.findByMemberPk(memberPk);
        }

        return Mono.justOrEmpty(attend)
                .switchIfEmpty(Mono.error(new RuntimeException("출석 정보 조회 실패")));
    }

    public Mono<Void> init(long memberPk) {
        return Mono.fromRunnable(() -> attendanceMapper.init(memberPk, LocalDate.now()))
                .onErrorMap(e -> new RuntimeException("출석 정보 초기화 실패"))
                .then();
    }


    public Mono<Attendance> update(long memberPk) {
        return findByMemberPk(memberPk)
                .doOnNext(this::updateAttendance)
                .doOnNext(attendanceMapper::update);
    }

    public Mono<AttendResponse.AttendInfo> findAttendInfo(String userId) {
        String key = "attend:" + userId + ":info";
        Object attendInfo = redisTemplate.opsForValue().get(key);

        if(Objects.isNull(attendInfo)) {
            addAttendInfoCache(userId);
            attendInfo = redisTemplate.opsForValue().get(key);
        }

        return Mono.justOrEmpty((AttendResponse.AttendInfo) attendInfo)
                .switchIfEmpty(Mono.error(new RuntimeException("출석 정보 조회 실패")));
    }

    public void addAttendInfoCache(String userId) {
        Member member = memberMapper.findMemberByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Attendance attendance = attendanceMapper.findByMemberPk(member.getId())
            .orElseThrow(() -> new RuntimeException("출석 정보 조회 실패"));
        AttendResponse.AttendInfo attendInfo = AttendResponse.AttendInfo.mergeUserAndAttendance(member, attendance);

        String key = "attend:" + member.getUserId() + ":info";
        redisTemplate.opsForValue().set(key, attendInfo, Duration.ofDays(1));
    }

    private void updateAttendance(Attendance attendance) {
        if (attendance.getLastDate().isEqual(LocalDate.now())) {
            throw new RuntimeException("오늘은 이미 출석 했습니다.");
        }

        if (attendance.getLastDate().plusDays(1).isEqual(LocalDate.now())) {
            attendance.setDays(attendance.getDays() + 1);
        } else {
            attendance.setDays(1);
        }

        attendance.setLastDate(LocalDate.now());
    }
}
