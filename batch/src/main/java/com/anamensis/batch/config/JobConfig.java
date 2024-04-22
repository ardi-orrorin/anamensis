package com.anamensis.batch.config;

import com.anamensis.batch.entity.UserConfigSmtp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.jdbc.Null;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.configuration.support.DefaultBatchConfiguration;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.adapter.ItemReaderAdapter;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.util.SimpleIdGenerator;

import javax.swing.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class JobConfig {

    private final SqlSessionFactory sqlSessionFactory;

    private final MailItemWriter mailItemWriter;

    @Bean
    public Job mailTestJob(JobRepository jobRepository, Step mailTestStep1) {
        return new JobBuilder("mail-test-job", jobRepository)
                .start(mailTestStep1)
                .incrementer(new RunIdIncrementer())
                .build();
    }

    @Bean
    public Step mailTestStep1(JobRepository jobRepository, PlatformTransactionManager tm) throws Exception {
        return new StepBuilder("mail-test-step", jobRepository)
                .<UserConfigSmtp, UserConfigSmtp>chunk(100, tm)
                .reader(myBatisCursorItemReader(null))
                .writer(mailItemWriter)
                .allowStartIfComplete(true)
                .build();
    }

    @Bean
    public Job emailApiJob(JobRepository jobRepository, Step emailApiStep){
        return new JobBuilder("email-api-job", jobRepository)
                .start(emailApiStep)
                .incrementer(new RunIdIncrementer())
                .build();
    }

    @Bean
    public Step emailApiStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("email-api-step", jobRepository)
                .<UserConfigSmtp, UserConfigSmtp>chunk(2, tm)
                .reader(myBatisCursorItemReader(null))
                .writer(mailItemWriter)
                .allowStartIfComplete(true)
                .build();
    }

    @Bean
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
