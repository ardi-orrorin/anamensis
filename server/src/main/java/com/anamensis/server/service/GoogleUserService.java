package com.anamensis.server.service;

import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.RoleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcReactiveOAuth2UserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Collections;

@RequiredArgsConstructor
@Service
@Slf4j
public class GoogleUserService extends OidcReactiveOAuth2UserService {

    private final UserService userService;

    @Override
    public Mono<OidcUser> loadUser(
        OidcUserRequest userRequest
    ) throws OAuth2AuthenticationException {
        return super.loadUser(userRequest)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> {
                    String userId = userRequest.getClientRegistration().getRegistrationId() + "-" + u.getName();
                    userService.findUserByUserId(userId)
                        .subscribe(success -> {
                        }, error -> {
                            this.saveUser(userRequest, u).subscribe();
                        });
                })
                .flatMap(user -> Mono.just(new DefaultOidcUser(
                    Collections.singleton(new SimpleGrantedAuthority(RoleType.USER.name())),
                    userRequest.getIdToken(),
                    user.getUserInfo(),
                    "google"
                )));
    }

    private Mono<Void> saveUser(OidcUserRequest userRequest, OidcUser user) {
        return Mono.just(user)
                .flatMap(u -> {
                    String userId = userRequest.getClientRegistration().getRegistrationId() + "-" + u.getName();
                    UserRequest.Register register = new UserRequest.Register();
                    register.setId(userId);
                    register.setPwd("");
                    register.setName((u.getAttributes().get("name").toString()));
                    register.setEmail(u.getAttributes().get("email").toString());
                    register.setPhone("");
                    return Mono.just(register);
                })
                .flatMap(userService::saveUser)
                .then();

    }
}
