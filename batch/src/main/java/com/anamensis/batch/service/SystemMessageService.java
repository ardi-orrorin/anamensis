package com.anamensis.batch.service;

import com.anamensis.batch.entity.SystemMessage;
import com.anamensis.batch.mapper.SystemMessageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class SystemMessageService {

    private final SystemMessageMapper systemMessageMapper;

    public SystemMessage findByWebSysPk(String webSysPk) {
        return systemMessageMapper.findByWebSysPk(webSysPk)
                .orElseThrow(()-> new RuntimeException("SystemMessage not found"));
    }
}
