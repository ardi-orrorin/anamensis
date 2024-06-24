package com.anamensis.batch.job.dummyfile;

import com.anamensis.batch.entity.File;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.integration.async.AsyncItemProcessor;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
@Slf4j
public class DummyFileStep {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    private final S3Client s3Client;

    private final SqlSessionFactory sqlSessionFactory;

    private final VirtualThreadTaskExecutor taskExecutor;



    public Step dummyFileDeleteStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("dummy-file-delete-step", jobRepository)
                .<File, Future<File>>chunk(1, tm)
                .reader(dummyFileDeleteReader())
                .processor(this::asyncDummyFileDelete)
                .writer(this::dummyFileDeleteWriter)
                .allowStartIfComplete(true)
                .build();
    }

    private MyBatisCursorItemReader<File> dummyFileDeleteReader() {
        MyBatisCursorItemReaderBuilder<File> builder = new MyBatisCursorItemReaderBuilder<File>()
                .sqlSessionFactory(sqlSessionFactory);

        Map<String , Object> parameterValues = new HashMap<>();
        LocalDate to = LocalDate.now().minusDays(2);
        LocalDate from = to.minusDays(5);
        parameterValues.put("from", from);
        parameterValues.put("to", to);

        builder.queryId("com.anamensis.batch.mapper.FileMapper.selectDummyFile")
                .parameterValues(parameterValues);

        return builder.build();
    }

    private void dummyFileDeleteWriter(Chunk<? extends Future<File>> items) {
        new MyBatisBatchItemWriterBuilder<Future<File>>()
                .sqlSessionFactory(sqlSessionFactory)
                .statementId("com.anamensis.batch.mapper.FileMapper.disabledDummyFile")
                .itemToParameterConverter(file -> {
                    Map<String, Object> parameter = new HashMap<>();
                    try {
                        parameter.put("id", file.get().id());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }

                    return parameter;
                })
                .build()
                .write(items);
    }

    private Future<File> asyncDummyFileDelete(File file) throws Exception {
        AsyncItemProcessor<File, File> asyncItemProcessor = new AsyncItemProcessor<>();
        asyncItemProcessor.setDelegate(this::dummyFileDelete);
        asyncItemProcessor.setTaskExecutor(taskExecutor);
        return asyncItemProcessor.process(file);
    }

    private File dummyFileDelete(File file) {

        ObjectIdentifier.Builder image = ObjectIdentifier.builder()
                .key(file.filePath().substring(1) + file.fileName());

        String thumbnailFilename = file.fileName().substring(0, file.fileName().lastIndexOf("."))
            + "_thumb"
            + file.fileName().substring(file.fileName().lastIndexOf("."));

        ObjectIdentifier.Builder thumbnail = ObjectIdentifier.builder()
                .key(file.filePath().substring(1) + thumbnailFilename);


        s3Client.deleteObjects(builder -> builder
                .bucket(bucket)
                .delete(delete -> delete
                    .objects(image.build(), thumbnail.build())
                )
        );

        return file;
    }
}
