package com.anamensis.batch.config;

import com.anamensis.batch.entity.SystemMessage;
import com.anamensis.batch.entity.UserConfigSmtp;
import com.anamensis.batch.provider.MailProvider;
import com.anamensis.batch.service.SmtpPushHistoryService;
import com.anamensis.batch.service.SystemMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;
import reactor.util.retry.Retry;

import java.time.Duration;

@Slf4j
@RequiredArgsConstructor
@Component
public class MailItemWriter implements ItemWriter<UserConfigSmtp> {

    private final SmtpPushHistoryService smtpPushHistoryService;

    private final SystemMessageService smService;

    @Override
    public void write(Chunk<? extends UserConfigSmtp> items) throws Exception {

        SystemMessage sm  = smService.findByWebSysPk("015");
        String subject = sm.getSubject();
        String content = sm.getContent();
        log.info("subject: {}", items);

        Flux.fromIterable(items)
                .parallel()
                .runOn(Schedulers.boundedElastic())
                .doOnNext(item -> {
                    new MailProvider.Builder()
                        .config(item)
                        .message(item,subject, content, null)
                        .build()
                        .send()
                        .retryWhen(Retry.fixedDelay(10, Duration.ofMinutes(1)))
                        .subscribeOn(Schedulers.boundedElastic())
                        .doOnSuccess($ ->
                            smtpPushHistoryService.save(item, subject, content, "", "COMPLETED")
                        )
                        .doOnError(e ->
                            smtpPushHistoryService.save(item, subject, content, e.getMessage(), "FAILED")
                        )
                        .subscribe();
                })
                .subscribe();
    }
}