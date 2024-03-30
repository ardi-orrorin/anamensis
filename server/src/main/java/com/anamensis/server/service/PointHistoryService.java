package com.anamensis.server.service;

import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.mapper.PointHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointHistoryService {

    private final PointHistoryMapper pointHistoryMapper;

    public List<PointHistory> selectByPointHistory(PointHistory pointHistory) {
        return pointHistoryMapper.selectByPointHistory(pointHistory);
    }

    public boolean insert(PointHistory pointHistory) {
        int result = pointHistoryMapper.insert(pointHistory);

        if (result != 1 ) throw new RuntimeException("insert 실패");

        return true;
    }

}
