package com.anamensis.server.entity;

import com.anamensis.server.dto.SerializedJSONObject;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
public class SystemSetting {

    private int id;

    private SystemSettingKey key;

    private SerializedJSONObject value;
}
