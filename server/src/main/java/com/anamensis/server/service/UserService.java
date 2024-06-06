package com.anamensis.server.service;


import com.anamensis.server.dto.UserDto;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.exception.DuplicateUserException;
import com.anamensis.server.mapper.MemberMapper;
import com.anamensis.server.mapper.PointCodeMapper;
import com.anamensis.server.resultMap.MemberResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
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
                .onErrorMap(e -> new RuntimeException("User not found"))
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
                .doOnNext(user -> {
                    if (!bCryptPasswordEncoder.matches(pwd, user.getPwd())) {
                        throw new RuntimeException("Password not matched");
                    }
                });
    }

    public Mono<MemberResultMap> findUserInfo(String userId) {
        return Mono.justOrEmpty(memberMapper.findMemberInfo(userId))
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return Mono.justOrEmpty(memberMapper.findMemberInfo(username))
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
                .map(user -> new UserDto(
                        user.getMember().getUserId(),
                        user.getMember().getPwd(),
                        user.getRoles().stream().map(Role::getRole).toList()
                ));
    }

    public Mono<Boolean> updatePoint(long memberPk, int point) {
        if(memberPk == 0) return Mono.error(new RuntimeException("User not found"));
        if(point <= 0) return Mono.error(new RuntimeException("Point must be greater than 0"));
        return Mono.fromCallable(() -> memberMapper.updatePoint(memberPk, point) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> existsUser(UserRequest.existsMember existsMember) {
        return Mono.fromCallable(() -> memberMapper.existsMember(existsMember));
    }

    public Mono<Boolean> editAuth(long memberPk, boolean isAuth, AuthType authType) {
        if(memberPk == 0) return Mono.error(new RuntimeException("User not found"));
        return Mono.fromCallable(() -> memberMapper.editAuth(memberPk, isAuth, authType) > 0)
                .onErrorReturn(false);
    }


    public Mono<Member> saveUser(UserRequest.Register user) {

        Member member = UserRequest.Register.transToUser(user);
        member.setPwd(bCryptPasswordEncoder.encode(member.getPwd()));
        member.setCreateAt(LocalDateTime.now());
        member.setSAuthType(AuthType.NONE);

        try {
            pointCodeMapper.selectByIdOrName(0,ATTENDANCE_POINT_CODE_PREFIX + "1")
                    .ifPresentOrElse(
                            pc -> member.setPoint(pc.getPoint()),
                            () -> new RuntimeException("Point code not found")
                    );
            memberMapper.save(member);
        } catch (Exception e) {
            return Mono.error(new RuntimeException("User not save"));
        }


        return generateRole(member, RoleType.USER)
                .doOnNext(memberMapper::saveRole)
                .flatMap(u -> Mono.just(member))
                .onErrorMap(e -> new DuplicateUserException(e.getMessage(), HttpStatus.BAD_REQUEST));
    }

    public Mono<Boolean> updateUser(Member member) {
        if(member.getName() == null && member.getEmail() == null && member.getPhone() == null) {
            return Mono.error(new RuntimeException("Name or Email or Phone number is required"));
        }

        return Mono.fromCallable(() -> memberMapper.update(member) > 0)
                .onErrorReturn(false);
    }

//    public Mono<Integer> deleteRole(Tuple2<UserDetails, RoleType> tuple) {
//        return tuple.mapT1(ud -> findUserByUserId(ud.getUsername()))
//                .mapT1(user -> user.flatMap(u -> generateRole(u, tuple.getT2())))
//                .mapT1(user -> user.map(memberMapper::deleteRole))
//                .getT1();
//    }


    private Mono<Role> generateRole(Member users, RoleType roleType) {
        Role role = new Role();
        role.setMemberPk(users.getId());
        role.setRole(roleType);
        return Mono.just(role);
    }

}
