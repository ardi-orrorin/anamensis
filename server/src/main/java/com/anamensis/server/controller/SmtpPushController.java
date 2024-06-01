package com.anamensis.server.controller;

import com.anamensis.server.service.SmtpPushService;
import com.anamensis.server.service.MemberConfigSmtpService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/smtp-push")
@RequiredArgsConstructor
public class SmtpPushController {
    private final SmtpPushService smtpPushService;

    private final MemberConfigSmtpService userConfigSmtpService;

    private final UserService userService;

}
