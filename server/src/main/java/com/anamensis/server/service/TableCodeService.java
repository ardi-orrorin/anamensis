package com.anamensis.server.service;

import com.anamensis.server.entity.TableCode;
import com.anamensis.server.mapper.TableCodeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Transactional
public class TableCodeService {

    private final TableCodeMapper tableCodeMapper;

    public Mono<TableCode> findByIdByTableName(long id, String tableName) {

        return Mono.justOrEmpty(tableCodeMapper.findByIdByTableName(id, tableName))
                .switchIfEmpty(Mono.error(new RuntimeException("테이블 코드가 없습니다.")));
    }

}
