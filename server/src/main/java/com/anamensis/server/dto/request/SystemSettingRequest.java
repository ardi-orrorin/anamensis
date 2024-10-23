package com.anamensis.server.dto.request;


import com.anamensis.server.entity.SystemSettingKey;
import org.json.JSONObject;

import java.util.Map;

public class SystemSettingRequest {

    public static class Update {
        public String key;
        public Map<String, Object> value;

        public SystemSettingKey getKey() {
            return SystemSettingKey.valueOf(key.toUpperCase());
        }

        public JSONObject getValue() {
            return new JSONObject(value);
        }
    }
}
