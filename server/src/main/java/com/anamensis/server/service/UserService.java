package com.anamensis.server.service;


import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.UserDto;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.exception.DuplicateUserException;
import com.anamensis.server.mapper.MemberMapper;
import com.anamensis.server.mapper.PointCodeMapper;
import com.anamensis.server.mapper.PointHistoryMapper;
import com.anamensis.server.provider.MailProvider;
import com.anamensis.server.resultMap.MemberResultMap;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements ReactiveUserDetailsService {

    private static final Map<String, String> OAUTH_ACCOUNT_PREFIX = Map.of(
        "GOOGLE", "G",
        "KAKAO", "K",
        "NAVER", "N",
        "GITHUB", "GH",
        "FACEBOOK", "FB",
        "CUSTOM", "CS"
    );

    private final MemberMapper memberMapper;

    private final PointHistoryMapper pointHistoryMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    private final Set<SystemSetting> systemSettings;

    private final MailProvider mailProvider;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Mono<Long> count(UserRequest.Params params) {
        return Mono.fromCallable(() -> memberMapper.count(params));
    }


    public Flux<UserResponse.List> findAllMember(Page page, UserRequest.Params params) {
        return Flux.fromIterable(memberMapper.findAllMember(page, params))
            .map(UserResponse.List::transToList);
    }


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

    public Mono<MemberResultMap> findOauthUser(UserRequest.OauthLogin user) {
        String userId = oAuthUserIdConvert(user.getUserId(), user.getProvider());
        return Mono.fromCallable(() -> memberMapper.findMemberInfo(userId))
            .flatMap(memberResultMap -> {
                if(memberResultMap.isEmpty()) {

                    String tempPwd = bCryptPasswordEncoder.encode(user.getUserId() + user.getProvider() + LocalDateTime.now().getNano());

                    UserRequest.Register newUser = new UserRequest.Register();
                    newUser.setId(userId);
                    newUser.setName(user.getName());
                    newUser.setPwd(tempPwd);

                    if(user.getEmail().equals("")) {
                        String tempId = UUID.randomUUID().toString().replaceAll("-", "");

                        String domain = systemSettings.stream()
                            .filter(setting -> setting.getKey() == SystemSettingKey.SITE)
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Domain setting not found"))
                            .getValue()
                            .getString("domain");


                        newUser.setEmail(tempId + "@" + domain);
                    } else {
                        newUser.setEmail(user.getEmail());
                    }

                    return this.saveUser(newUser, true)
                        .flatMap(m -> {
                            Role role = new Role();
                            role.setMemberPk(m.getId());
                            role.setRole(RoleType.OAUTH);

                            return Mono.just(memberMapper.saveRole(role) > 0);
                        })
                        .flatMap($ -> Mono.justOrEmpty(memberMapper.findMemberInfo(userId)))
                        .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
                } else {
                    return Mono.just(memberResultMap.get());
                }
            });
    }

    public Mono<UserResponse.MyPage> findUserInfoCache(String userId) {
        String key =  "user:" + userId + ":info";

        return Mono.fromCallable(()-> redisTemplate.hasKey(key))
            .flatMap(hasKey -> {
                if(hasKey) {
                    return Mono.fromCallable(() -> redisTemplate.opsForValue().get(key));
                } else {
                    return addUserInfoCache(userId)
                        .thenReturn(redisTemplate.opsForValue().get(key));
                }
            })
            .flatMap(attendInfo -> Mono.justOrEmpty((UserResponse.MyPage) attendInfo))
            .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
    }

    public Mono<List<MemberResultMap.ListItem>> findMemberByUsernames(List<String> usernames) {
        return Flux.fromIterable(memberMapper.findMemberByUsernames(usernames))
            .collectList();
    }

    public Mono<Void> addUserInfoCache(String userId) {
        MemberResultMap member = memberMapper.findMemberInfo(userId).orElseThrow(() ->
            new RuntimeException("User not found"));

        UserResponse.MyPage myPage = UserResponse.MyPage.transToMyPage(member);
        redisTemplate.opsForValue().set("user:" + userId + ":info", myPage, Duration.ofDays(1));
        return Mono.empty();
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

    public Mono<Boolean> updatePoint(long memberPk, long point) {
        if(memberPk == 0) return Mono.error(new RuntimeException("User not found"));
        if(point <= 0) return Mono.error(new RuntimeException("Point must be greater than 0"));
        return Mono.fromCallable(() -> memberMapper.updatePoint(memberPk, point) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> subtractPoint(long memberPk, long point) {
        if(memberPk == 0) return Mono.error(new RuntimeException("User not found"));
        if(point <= 0) return Mono.error(new RuntimeException("Point must be greater than 0"));
        return Mono.fromCallable(() -> memberMapper.subtractPoint(memberPk, point) > 0)
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


    public Mono<Member> saveUser(UserRequest.Register user, boolean isOAuth) {

        long point = 100;

        Member member = UserRequest.Register.transToUser(user);
        member.setPwd(bCryptPasswordEncoder.encode(member.getPwd()));
        member.setCreateAt(LocalDateTime.now());
        member.setSAuthType(AuthType.NONE);
        member.setOAuth(isOAuth);
        member.setSAuth(false);
        member.setPoint(point);

        int isSave = memberMapper.save(member);

        if(isSave == 0) return Mono.error(new RuntimeException("User save failed"));

        // fixme: 포인트 이력 저장 (point 히스토리 관련 로직 전체 수정 필요)
//        PointHistory pointHistory = new PointHistory();
//        pointHistory.setMemberPk(member.getId());


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


    public Mono<Member> findMemberByEmailAndUserId(String email, String userId) {
        return Mono.justOrEmpty(memberMapper.findMemberByEmailAndUserId(email, userId))
            .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
    }

    public Mono<Boolean> resetPwd(UserRequest.ResetPwd resetPwd) {

        String password = bCryptPasswordEncoder.encode(resetPwd.getPwd());

        return Mono.fromCallable(() -> memberMapper.updatePwd(resetPwd.getUserId(), password, resetPwd.getEmail()) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> confirmPassword(String userId, String pwd) {
        return Mono.justOrEmpty(memberMapper.findMemberByUserId(userId))
            .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
            .map(member -> bCryptPasswordEncoder.matches(pwd, member.getPwd()));
    }

    public Mono<Boolean> changeAuthAlertEmail(
        Member member,
        AuthType authType
    ) {

        return checkSMTPEnabled()
            .flatMap(enabled -> {
                if(!enabled) return Mono.just(true);
                String subject = authType == AuthType.NONE ? "2차 인증이 비활성화 되었습니다." : "2차 인증이 활성화 되었습니다.";

                String bodyTemplate = """
                    %s님의 2차 인증 설정이 변경되었습니다. </br> 
                    변경 시간 : %s
                """;

                MailProvider.MailMessage mailMessage = new MailProvider.MailMessage(
                    member.getEmail(),
                    subject,
                    String.format(bodyTemplate, member.getName(), LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                );

                return mailProvider.sendMessage(mailMessage);
            });

    }

    public Mono<Boolean> unConfirmLogin(Member member, Device device) {
        return checkSMTPEnabled()
            .flatMap(enabled -> {
                if(!enabled) return Mono.just(true);
                String subject = "새로운 장소에서 로그인이 발생했습니다.";
                String bodyTemplate = """
                    ip : %s </br>
                    device : %s </br>
                    location : %s </br>
                    dateTime : %s </br>
                    에서 로그인이 발생했습니다.
                """;

                String body = String.format(bodyTemplate, device.ip(), device.device(), device.Location(), LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

                MailProvider.MailMessage mailMessage = new MailProvider.MailMessage(
                    member.getEmail(),
                    subject,
                    body
                );

                return mailProvider.sendMessage(mailMessage);
            });
    }

    private Mono<Boolean> checkSMTPEnabled() {
        return Mono.fromCallable(() ->
            systemSettings.stream()
                .filter(setting -> setting.getKey() == SystemSettingKey.SMTP)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("System setting not found"))
                .getValue()
                .getBoolean("enabled")
        );
    }

    private String oAuthUserIdConvert(String userId, String provider) {
        return OAUTH_ACCOUNT_PREFIX.get(provider.toUpperCase()) + "-" + userId;
    }

    private Mono<Role> generateRole(Member users, RoleType roleType) {
        Role role = new Role();
        role.setMemberPk(users.getId());
        role.setRole(roleType);
        return Mono.just(role);
    }

    public Mono<Boolean> updateRole(UserRequest.UpdateRole role) {
        return Mono.fromCallable(() -> {
                if("add".equalsIgnoreCase(role.getMode())) {
                    return memberMapper.saveRoles(role.getIds(), role.getRole()) > 0;
                } else if("delete".equalsIgnoreCase(role.getMode())) {
                    return memberMapper.deleteRoles(role.getIds(), role.getRole()) > 0;
                } else {
                    return false;
                }
            })
            .onErrorReturn(false);

    }

    public Mono<Boolean> changePwd(String userId, String newPwd) {
        if(newPwd.length() < 8 || newPwd.length() > 255) {
            return Mono.error(new RuntimeException("Password must be at least 8 characters"));
        }

        String password = bCryptPasswordEncoder.encode(newPwd);

        return Mono.fromCallable(() -> memberMapper.updatePwd(userId, password, "") > 0)
                .onErrorReturn(false);
    }
}
