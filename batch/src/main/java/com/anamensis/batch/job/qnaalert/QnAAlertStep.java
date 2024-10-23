package com.anamensis.batch.job.qnaalert;

import com.anamensis.batch.dto.SelectAnswerQueueDto;
import com.anamensis.batch.entity.MemberConfigSmtp;
import com.anamensis.batch.provider.MailProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.integration.async.AsyncItemProcessor;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.redis.RedisItemReader;
import org.springframework.batch.item.redis.builder.RedisItemReaderBuilder;
import org.springframework.batch.item.redis.builder.RedisItemWriterBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.data.redis.connection.DataType;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
@Slf4j
public class QnAAlertStep {

    private final VirtualThreadTaskExecutor taskExecutor;

    private final RedisTemplate<String, SelectAnswerQueueDto> redisTemplate;

    public Step qnaAlertStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("qna-alert-step", jobRepository)
                .<SelectAnswerQueueDto, Future<SelectAnswerQueueDto>>chunk(1, tm)
                .reader(reader(null))
                .processor(this::asyncQnAAlertProcessor)
                .writer(this::qnaAlertWriter)
                .allowStartIfComplete(true)
                .build();
    }

    private void qnaAlertWriter(Chunk<? extends Future<SelectAnswerQueueDto>> futures) throws Exception {
        new RedisItemWriterBuilder<String, SelectAnswerQueueDto>()
            .redisTemplate(redisTemplate)
            .delete(true)
            .build()
            .write((Chunk<? extends SelectAnswerQueueDto>) futures);
    }

    private Future<SelectAnswerQueueDto> asyncQnAAlertProcessor(SelectAnswerQueueDto o) throws Exception {
        AsyncItemProcessor<SelectAnswerQueueDto, SelectAnswerQueueDto> processor = new AsyncItemProcessor<>();
        processor.setDelegate(this::qnaAlertProcessor);
        processor.setTaskExecutor(taskExecutor);
        return processor.process(o);
    }

    private SelectAnswerQueueDto qnaAlertProcessor(SelectAnswerQueueDto o) {
//        SelectAnswerQueueDto dto = (SelectAnswerQueueDto) o;
//
//        MemberConfigSmtp config = new MemberConfigSmtp();
//        config.setHost(dto.getSmtpHost());
//        config.setPort(dto.getSmtpPort());
//        config.setUsername(dto.getSmtpUser());
//        config.setPassword(dto.getSmtpPassword());
//        config.setUseSSL(true);
//
//
//        String subject = "질문 답변에 채택되었습니다.";
//        String body = dto.getBoardTitle();
//
//
//        new MailProvider.Builder()
//            .message(config, subject, body, null)
//            .build().send();

        return o;
    }


    private RedisItemReader<String, SelectAnswerQueueDto> reader(@Value("#{jobParameters['ids']}") String ids) {
        RedisItemReaderBuilder<String, SelectAnswerQueueDto> builder = new RedisItemReaderBuilder<>();

        ScanOptions options = ScanOptions.scanOptions()
            .type(DataType.LIST)
            .match("select:answer:queue")
            .build();

        return builder
            .redisTemplate(redisTemplate)
            .scanOptions(options)
            .build();
    }
}
