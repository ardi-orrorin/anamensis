package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.File;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface FileMapper {

    List<File> selectDummyFile(LocalDate from, LocalDate to);

    int disabledDummyFile(long id);

    int deleteDummyFile(long id);

}
