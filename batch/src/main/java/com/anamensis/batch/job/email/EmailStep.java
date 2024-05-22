package com.anamensis.batch.job.email;

import com.anamensis.batch.entity.UserConfigSmtp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailStep {

    private final SqlSessionFactory sqlSessionFactory;

    private final MailItemWriter mailItemWriter;

    public Step emailSendStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("email-send-step", jobRepository)
                .<UserConfigSmtp, UserConfigSmtp>chunk(2, tm)
                .reader(myBatisCursorItemReader(null))
                .writer(mailItemWriter)
                .allowStartIfComplete(true)
                .build();
    }

    @StepScope
    private MyBatisCursorItemReader<UserConfigSmtp> myBatisCursorItemReader(@Value("#{jobParameters['ids']}") String ids) {

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
