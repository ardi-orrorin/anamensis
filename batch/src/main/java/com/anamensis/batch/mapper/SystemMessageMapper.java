package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.SystemMessage;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface SystemMessageMapper {

    Optional<SystemMessage> findByWebSysPk(String webSysPk);


}
