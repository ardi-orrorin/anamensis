package com.anamensis.server.service;

import com.anamensis.server.entity.PointCode;
import com.anamensis.server.mapper.PointCodeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointCodeMapper pointCodeMapper;

    public List<PointCode> selectAll() {
        return pointCodeMapper.selectAll();
    }

    public List<PointCode> selectByIdOrName(PointCode pointCode) {
        return pointCodeMapper.selectByIdOrName(pointCode);
    }

    @Transactional
    public boolean insert(PointCode pointCode) {
        int result = pointCodeMapper.insert(pointCode);

        if(result != 1) new RuntimeException("insert fail");

        return true;
    }

}
