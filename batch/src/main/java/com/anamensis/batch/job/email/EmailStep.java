package com.anamensis.batch.job.email;

import com.anamensis.batch.entity.SmtpPushHistory;
import com.anamensis.batch.entity.SystemMessage;
import com.anamensis.batch.entity.UserConfigSmtp;
import com.anamensis.batch.provider.MailProvider;
import com.anamensis.batch.service.SystemMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.integration.async.AsyncItemProcessor;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailStep {

    private final SqlSessionFactory sqlSessionFactory;

    private final VirtualThreadTaskExecutor taskExecutor;

    private final SystemMessageService smService;

    @Value("${db.setting.default.web_sys_pk}")
    private String DEFAULT_WEB_SYS_PK;

    public Step emailSendStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        SystemMessage sm = smService.findByWebSysPk(DEFAULT_WEB_SYS_PK);

        return new StepBuilder("email-send-step", jobRepository)
                .<UserConfigSmtp, Future<SmtpPushHistory>>chunk(1, tm)
                .reader(myBatisCursorItemReader(null))
                .processor(userConfigSmtp -> asyncEmailSendProcessor(userConfigSmtp, sm))
                .writer(this::saveHistory)
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

    private Future<SmtpPushHistory> asyncEmailSendProcessor(UserConfigSmtp item, SystemMessage sm) throws Exception {
        AsyncItemProcessor<UserConfigSmtp, SmtpPushHistory> asyncItemProcessor = new AsyncItemProcessor<>();
        asyncItemProcessor.setDelegate(userConfigSmtp -> sendMail(userConfigSmtp, sm));
        asyncItemProcessor.setTaskExecutor(taskExecutor);
        return asyncItemProcessor.process(item);
    }

    private  SmtpPushHistory sendMail(UserConfigSmtp item, SystemMessage sm) {
        String subject = sm.getSubject();
        String content = sm.getContent();

        new MailProvider.Builder()
            .config(item)
            .message(item,subject, content, null)
            .build()
            .send();

        SmtpPushHistory smtpPushHistory = new SmtpPushHistory();
        try {
            smtpPushHistory.setUserPk(item.getUserPk());
            smtpPushHistory.setUserConfigSmtpPk(item.getId());
            smtpPushHistory.setSubject(subject);
            smtpPushHistory.setContent(content);
            smtpPushHistory.setMessage("");
            smtpPushHistory.setStatus("COMPLETED");
            smtpPushHistory.setCreateAt(LocalDateTime.now());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return smtpPushHistory;
    }

    private void saveHistory(Chunk<? extends Future<SmtpPushHistory>> chunk) {
        new MyBatisBatchItemWriterBuilder<Future<SmtpPushHistory>>()
                .sqlSessionFactory(sqlSessionFactory)
                .statementId("com.anamensis.batch.mapper.SmtpPushHistoryMapper.save")
                .itemToParameterConverter(smtpPushHistoryFuture -> {
                    try {
                        return smtpPushHistoryFuture.get();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .build()
                .write(chunk);
    }


}
