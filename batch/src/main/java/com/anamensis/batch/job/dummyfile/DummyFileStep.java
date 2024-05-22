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
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
@Slf4j
public class DummyFileStep {

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
        LocalDate to = LocalDate.now().minusDays(1);
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
                .statementId("com.anamensis.batch.mapper.FileMapper.deleteDummyFile")
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

        java.io.File fileToDelete = new java.io.File(file.filePath() + file.fileName());

        boolean result = false;

        if(fileToDelete.exists()) {
            result = fileToDelete.delete();
            result = fileToDelete.getParentFile().delete();
        }

//        if(result) {
//            log.info("DummyFileService.dummyFileDeleteProcessor: fileToDelete.delete() success");
//        } else {
//            log.info("DummyFileService.dummyFileDeleteProcessor: fileToDelete.delete() failed");
//        }

        return file;
    }
}
