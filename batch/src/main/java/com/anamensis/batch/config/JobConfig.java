package com.anamensis.batch.config;

import com.anamensis.batch.entity.UserConfigSmtp;
import com.anamensis.batch.provider.MailProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class JobConfig {

    private final SqlSessionFactory sqlSessionFactory;

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
                .<UserConfigSmtp, UserConfigSmtp>chunk(10, tm)
                .reader(myBatisCursorItemReader())
                .writer(itemWriter())
//                .taskExecutor(new SimpleAsyncTaskExecutor())
                .allowStartIfComplete(true)
                .build();
    }

    @Bean
    public MyBatisCursorItemReader<UserConfigSmtp> myBatisCursorItemReader() throws Exception {
        return new MyBatisCursorItemReaderBuilder<UserConfigSmtp>()
                .sqlSessionFactory(sqlSessionFactory)
                .queryId("com.anamensis.batch.mapper.UserConfigSmtpMapper.findAll")
                .build();
    }

    @Bean
    public ItemWriter<UserConfigSmtp> itemWriter() {
        return items -> {
            Flux.fromIterable(items)
                    .parallel()
                    .runOn(Schedulers.parallel())
                    .flatMap(smtp ->
                        new MailProvider.Builder()
                                .config(smtp)
                                .message(smtp, "Hello World", "Hello World")
                                .build()
                                .send()
                                .subscribeOn(Schedulers.parallel())
                    )
                    .subscribe();
        };
    }

    @Bean
    public Job job2(JobRepository jobRepository, Step step2) {
        return new JobBuilder("job2", jobRepository)
                .start(step2)
                .incrementer(new RunIdIncrementer())
                .build();
    }

//    @Bean
//    public Step step2(JobRepository jobRepository, PlatformTransactionManager tm) {
//        return new StepBuilder("step2", jobRepository)
//                .tasklet((con, chunk) -> {
//                    System.out.println("Hello World 22222222222222222");
//                    return RepeatStatus.FINISHED;
//                },tm)
//                .allowStartIfComplete(true)
//                .build();
//    }
}
