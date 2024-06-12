package com.anamensis.server.config.converter;

import com.anamensis.server.dto.ResetPwdProgress;
import org.springframework.core.convert.converter.Converter;

public class StringToResetPwdProgress implements Converter<String, ResetPwdProgress> {
    @Override
    public ResetPwdProgress convert(String source) {
        try {
           return ResetPwdProgress.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
