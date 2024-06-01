package com.anamensis.server.config.converter;

import com.anamensis.server.entity.RoleType;
import org.springframework.core.convert.converter.Converter;

public class StringToRoleTypeConverter implements Converter<String, RoleType> {
    @Override
    public RoleType convert(String source) {
        try {
           return RoleType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
