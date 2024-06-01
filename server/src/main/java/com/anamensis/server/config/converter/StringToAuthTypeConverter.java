package com.anamensis.server.config.converter;

import com.anamensis.server.entity.AuthType;
import org.springframework.core.convert.converter.Converter;

public class StringToAuthTypeConverter implements Converter<String, AuthType> {
    @Override
    public AuthType convert(String source) {
        try {
           return AuthType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
