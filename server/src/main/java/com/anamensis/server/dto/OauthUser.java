package com.anamensis.server.dto;

import com.anamensis.server.entity.RoleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
@Setter
public class OauthUser implements OAuth2User {

    private String username;
    private String password;

    private Map<String, Object> attributes;

    List<RoleType> authorities;

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities.stream()
            .map(authority -> (GrantedAuthority) authority::toString)
            .toList();
    }

    @Override
    public String getName() {
        return this.username;
    }
}
