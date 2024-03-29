package com.anamensis.server.service;


import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.LoginHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoginHistoryService {
    private final LoginHistoryMapper loginHistoryMapper;

    public void save(LoginHistory loginHistory, User user) {
        loginHistory.setCreateAt(LocalDateTime.now());
        int save = loginHistoryMapper.save(loginHistory, user);
        if(save != 1) throw new RuntimeException("LoginHistory save failed");
    }
}
