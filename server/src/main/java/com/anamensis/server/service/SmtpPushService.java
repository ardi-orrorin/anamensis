package com.anamensis.server.service;

import com.anamensis.server.mapper.SmtpPushMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SmtpPushService {

    private final SmtpPushMapper smtpPushMapper;


}
