package com.anamensis.server.mapper;

import com.anamensis.server.entity.Attendance;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.Optional;

@Mapper
public interface AttendanceMapper {
    void init(long memberPk, LocalDate lastDate);

    void update(Attendance attendance);

    Optional<Attendance> findByMemberPk(long memberPk);

    boolean exist(long memberPk);
}
