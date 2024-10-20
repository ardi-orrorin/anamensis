package com.anamensis.server.mapper;

import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SystemSettingMapper {

    List<SystemSetting> findAll(Boolean isPublic);

    SystemSetting findByKey(SystemSettingKey key);

    int update(SystemSetting systemSetting);

    int init(SystemSettingKey key);
}
