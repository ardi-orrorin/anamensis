package com.anamensis.server.dto.response;

import com.anamensis.server.entity.SystemSetting;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class SystemSettingResponse {

    public static Map<String, Object> toList(List<SystemSetting> systemSettings) {
        return systemSettings.stream()
            .collect(
                HashMap::new,
                (jsonObject, systemSetting) -> jsonObject.put(systemSetting.getKey().name().toLowerCase(), systemSetting.getValue().toMap()),
                HashMap::putAll
            );
    }
}
