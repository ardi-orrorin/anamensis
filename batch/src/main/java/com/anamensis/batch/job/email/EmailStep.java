package com.anamensis.batch.job.email;

import com.anamensis.batch.entity.MemberConfigSmtp;
import com.anamensis.batch.entity.SmtpPushHistory;
import com.anamensis.batch.entity.SystemMessage;
import com.anamensis.batch.job.factory.AbstractMybatisStep;
import com.anamensis.batch.provider.MailProvider;
import com.anamensis.batch.service.SystemMessageService;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.Future;

@Component
public class EmailStep extends AbstractMybatisStep<MemberConfigSmtp, SmtpPushHistory> {

    @Autowired
    private SystemMessageService smService;

    @Value("${db.setting.default.web_sys_pk}")
    private String DEFAULT_WEB_SYS_PK;

    private SystemMessage sm;

    public EmailStep(SqlSessionFactory sqlSessionFactory, VirtualThreadTaskExecutor taskExecutor) {
        super(sqlSessionFactory, taskExecutor);
    }

    @Override
    public Step step(int chunkSize, String jobName, JobRepository jobRepository, PlatformTransactionManager tm) {
        sm = smService.findByWebSysPk(DEFAULT_WEB_SYS_PK);
        return super.step(chunkSize, jobName, jobRepository, tm);
    }

    @Override
    public void writer(Chunk<? extends Future<SmtpPushHistory>> futures, Optional<String> SaveMapper, Converter<SmtpPushHistory, ?> itemToParameterConverter) throws Exception {
        super.writer(futures, SaveMapper, itemToParameterConverter);
    }

    @StepScope
    @Override
    public MyBatisCursorItemReader<MemberConfigSmtp> reader(Optional<String> findMapper, @Value("#{jobParameters['ids']}") String ids) {

        String findMapperIdStr = ids != null && !ids.equals("")
        ? "com.anamensis.batch.mapper.UserConfigSmtpMapper.findByIds"
        : "com.anamensis.batch.mapper.UserConfigSmtpMapper.findAll";

        Optional<String> findMapperId = Optional.of(findMapperIdStr);

        return super.reader(findMapperId, ids);
    }

    @Override
    public SmtpPushHistory delegate(MemberConfigSmtp input) {
        String subject = sm.getSubject();
        String content = sm.getContent();

        new MailProvider.Builder()
            .config(input)
            .message(input,subject, content, null)
            .build()
            .send();

        SmtpPushHistory smtpPushHistory = new SmtpPushHistory();

        try {
            smtpPushHistory.setUserPk(input.getMemberPk());
            smtpPushHistory.setUserConfigSmtpPk(input.getId());
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
}
