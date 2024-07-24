package com.anamensis.server.service;

import com.anamensis.server.mapper.BoardTemplateMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardTemplateService {

    private final BoardTemplateMapper boardTemplateMapper;

}
