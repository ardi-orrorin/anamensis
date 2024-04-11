package com.anamensis.server.controller;

import com.anamensis.server.service.SmtpPushService;
import com.anamensis.server.service.UserConfigSmtpService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/smtp-push")
@RequiredArgsConstructor
public class SmtpPushController {
    private final SmtpPushService smtpPushService;

    private final UserConfigSmtpService userConfigSmtpService;

    private final UserService userService;

}
