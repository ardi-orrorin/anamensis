package com.anamensis.server.config.converter;

import org.json.JSONObject;
import org.springframework.core.convert.converter.Converter;

import java.util.Map;

public class JSONobjectTypeConverter implements Converter<Map<String, Object>, JSONObject> {
    @Override
    public JSONObject convert(Map<String, Object> source) {
        return new JSONObject(source);
    }
}
