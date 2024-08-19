package com.anamensis.server.service;

import com.anamensis.server.dto.response.AttendResponse;
import com.anamensis.server.entity.Attendance;
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
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    private final MemberMapper memberMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    public Mono<Boolean> exist(long memberPk) {
        return Mono.just(attendanceMapper.exist(memberPk));
    }

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
                .flatMap(this::updateAttendance)
                .doOnNext(attendanceMapper::update);
    }

//    public Mono<AttendResponse.AttendInfo> findAttendInfo(String userId) {
//        String key = "attend:" + userId + ":info";
//
//        return Mono.fromCallable(() -> redisTemplate.hasKey(key))
//            .flatMap(hasKey -> {
//                if(hasKey) {
//                    return Mono.fromCallable(() -> redisTemplate.opsForValue().get(key));
//
//                } else {
//                    return addAttendInfoCache(userId)
//                            .then(Mono.fromCallable(() -> redisTemplate.opsForValue().get(key)));
//                }
//
//            })
//            .flatMap(attendInfo -> Mono.justOrEmpty((AttendResponse.AttendInfo) attendInfo))
//            .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
//    }

//    public Mono<Void> addAttendInfoCache(String userId) {
//        AtomicReference<Member> memberAtomic = new AtomicReference<>();
//        return Mono.justOrEmpty(memberMapper.findMemberByUserId(userId))
//            .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
//            .doOnNext(memberAtomic::set)
//            .flatMap(m -> Mono.justOrEmpty(attendanceMapper.findByMemberPk(m.getId())))
//            .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
//            .flatMap(attendance -> Mono.fromCallable(() ->
//                AttendResponse.AttendInfo.mergeUserAndAttendance(memberAtomic.get(), attendance)
//            ))
//            .doOnNext(attendInfo1 -> {
//                String key = "attend:" + memberAtomic.get().getUserId() + ":info";
//                redisTemplate.opsForValue().set(key, attendInfo1, Duration.ofDays(1));
//            })
//            .then();
//    }

    private Mono<Attendance> updateAttendance(Attendance attendance) {
        if (attendance.getLastDate().isEqual(LocalDate.now())) {
            return Mono.error(new RuntimeException("오늘은 이미 출석 했습니다."));
        }

        if (attendance.getLastDate().plusDays(1).isEqual(LocalDate.now())) {
            attendance.setDays(attendance.getDays() + 1);
        } else {
            attendance.setDays(1);
        }

        attendance.setLastDate(LocalDate.now());

        return Mono.just(attendance);
    }
}
