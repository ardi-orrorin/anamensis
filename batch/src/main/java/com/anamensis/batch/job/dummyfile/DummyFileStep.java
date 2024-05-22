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
import org.springframework.batch.item.Chunk;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class DummyFileStep {

    private final SqlSessionFactory sqlSessionFactory;

    public Step dummyFileDeleteStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("dummy-file-delete-step", jobRepository)
                .<File, File>chunk(200, tm)
                .reader(dummyFileDeleteReader())
                .processor(this::dummyFileDelete)
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

    private void dummyFileDeleteWriter(Chunk<? extends File> items) {
        new MyBatisBatchItemWriterBuilder<File>()
                .sqlSessionFactory(sqlSessionFactory)
                .statementId("com.anamensis.batch.mapper.FileMapper.deleteDummyFile")
                .itemToParameterConverter(file -> {
                    Map<String, Object> parameter = new HashMap<>();
                    parameter.put("id", file.id());
                    return parameter;
                })
                .build()
                .write(items);
    }


    private File dummyFileDelete(File file) {

        java.io.File fileToDelete = new java.io.File(file.filePath() + file.fileName());

        boolean result = false;

        if(fileToDelete.exists()) {
//            log.info("DummyFileService.dummyFileDeleteProcessor: fileToDelete: {} ", fileToDelete);
            result = fileToDelete.delete();
        }

//        if(result) {
//            log.info("DummyFileService.dummyFileDeleteProcessor: fileToDelete.delete() success");
//        } else {
//            log.info("DummyFileService.dummyFileDeleteProcessor: fileToDelete.delete() failed");
//        }

        return file;
    }
}
