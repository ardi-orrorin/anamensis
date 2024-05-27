package com.anamensis.server.service;


import com.anamensis.server.entity.*;
import com.anamensis.server.dto.UserDto;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.exception.DuplicateUserException;
import com.anamensis.server.mapper.MemberMapper;
import com.anamensis.server.mapper.PointCodeMapper;
import com.anamensis.server.resultMap.MemberResultMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements ReactiveUserDetailsService {

    @Value("${db.setting.user.attendance_point_code_prefix}")
    private String ATTENDANCE_POINT_CODE_PREFIX;

    private final MemberMapper memberMapper;
    private final PointCodeMapper pointCodeMapper;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Mono<Member> findUserByUserId(String userId) {
        return Mono.justOrEmpty(memberMapper.findMemberByUserId(userId))
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
    }

    public Mono<Member> findUserByUserId(String userId, String pwd) {
        return Mono.justOrEmpty(memberMapper.findMemberByUserId(userId))
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
                .onErrorMap(e -> new RuntimeException("User not found"))
                .doOnNext(user -> {
                    if (!bCryptPasswordEncoder.matches(pwd, user.getPwd())) {
                        throw new RuntimeException("Password not matched");
                    }
                });
    }

    public Mono<MemberResultMap> findUserInfo(String userId) {
        log.info("findUserInfo: {}", userId);
        return Mono.justOrEmpty(memberMapper.findMemberInfo(userId))
                .onErrorMap(e -> new RuntimeException("User not found"));
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return Mono.justOrEmpty(memberMapper.findMemberInfo(username))
                .map(user -> new UserDto(
                        user.getMember().getUserId(),
                        bCryptPasswordEncoder.encode(user.getMember().getPwd()),
                        user.getRoles().stream().map(Role::getRole).toList()
                ));
    }

    public Mono<Void> updatePoint(long userPk, int point) {
        memberMapper.updatePoint(userPk, point);
        return Mono.empty();
    }

    public Mono<Boolean> existsUser(UserRequest.existsMember existsMember) {
        return Mono.just(memberMapper.existsMember(existsMember));
    }

    public Mono<Boolean> editAuth(long id, boolean isAuth, AuthType authType) {
        return Mono.just(memberMapper.editAuth(id, isAuth, authType))
                .map(i -> i > 0);
    }

    @Transactional
    public Mono<Member> saveUser(Mono<UserRequest.Register> user) {
        return user.map(UserRequest.Register::transToUser)
                   .doOnNext(u -> u.setPwd(bCryptPasswordEncoder.encode(u.getPwd())))
                   .doOnNext(u -> u.setCreateAt(LocalDateTime.now()))
                   .doOnNext(u -> {
                       PointCode pointCode = pointCodeMapper.findByName(ATTENDANCE_POINT_CODE_PREFIX + "1")
                               .orElseThrow(() -> new RuntimeException("PointCode not found"));
                      u.setPoint(pointCode.getValue());
                   })
                   .doOnNext(memberMapper::save)
                   .publishOn(Schedulers.boundedElastic())
                   .doOnNext(u -> generateRole(u, RoleType.USER)
                           .doOnNext(memberMapper::saveRole)
                           .subscribe()
                   )
                   .onErrorMap(e -> new DuplicateUserException(e.getMessage(), HttpStatus.BAD_REQUEST));
    }

    @Transactional
    public Mono<Integer> saveRole(Tuple2<UserDetails, RoleType> tuple) {
        return tuple.mapT1(ud -> findUserByUserId(ud.getUsername()))
                .mapT1(user -> user.flatMap(u -> generateRole(u, tuple.getT2()))
                )
                .mapT1(user -> user.map(memberMapper::saveRole))
                .getT1();

    }

    @Transactional
    public Mono<Boolean> updateUser(Member users) {
        return Mono.just(memberMapper.update(users))
                .map(i -> i == 1);
    }

    @Transactional
    public Mono<Integer> deleteRole(Tuple2<UserDetails, RoleType> tuple) {
        return tuple.mapT1(ud -> findUserByUserId(ud.getUsername()))
                .mapT1(user -> user.flatMap(u -> generateRole(u, tuple.getT2())))
                .mapT1(user -> user.map(memberMapper::deleteRole))
                .getT1();
    }


    private Mono<Role> generateRole(Member users, RoleType roleType) {
        Role role = new Role();
        role.setMemberPk(users.getId());
        role.setRole(roleType);
        return Mono.just(role);
    }

}
