package com.anamensis.batch.job.email;

import com.anamensis.batch.entity.UserConfigSmtp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final SqlSessionFactory sqlSessionFactory;

    @StepScope
    public MyBatisCursorItemReader<UserConfigSmtp> myBatisCursorItemReader(@Value("#{jobParameters['ids']}") String ids) {

        MyBatisCursorItemReaderBuilder<UserConfigSmtp> builder = new MyBatisCursorItemReaderBuilder<UserConfigSmtp>()
                .sqlSessionFactory(sqlSessionFactory);

        if (ids != null && !ids.equals("")) {
            Map<String, Object> map = new HashMap<>();
            List<String> idList = List.of(ids.split(","));
            map.put("ids", idList);

            builder.parameterValues(map)
                    .queryId("com.anamensis.batch.mapper.UserConfigSmtpMapper.findByIds");
        } else {
            builder.queryId("com.anamensis.batch.mapper.UserConfigSmtpMapper.findAll");
        }

        return builder.build();
    }


}
