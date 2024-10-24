package com.anamensis.server.batch.job.dummyfile;

import com.anamensis.server.batch.job.factory.AbstractMybatisStep;
import com.anamensis.server.entity.File;
import com.anamensis.server.provider.FileProvider;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;

@Slf4j
@Component
public class DummyFileStep extends AbstractMybatisStep<File, File> {

    @Autowired
    private FileProvider fileProvider;

    private SqlSessionFactory sqlSessionFactory;

    public DummyFileStep(SqlSessionFactory sqlSessionFactory, VirtualThreadTaskExecutor taskExecutor) {
        super(sqlSessionFactory, taskExecutor);
        this.sqlSessionFactory = sqlSessionFactory;
    }

    @Override
    public Step step(int chunkSize, String jobName, JobRepository jobRepository, PlatformTransactionManager tm) {
        return super.step(chunkSize, jobName, jobRepository, tm);
    }

    @Override
    public MyBatisCursorItemReader<File> reader(Optional<String> findMapper, String ids) {

        Optional<String> findMapperId = Optional.of("com.anamensis.server.mapper.FileMapper.selectDummyFile");

        MyBatisCursorItemReaderBuilder<File> builder = new MyBatisCursorItemReaderBuilder<File>()
            .sqlSessionFactory(sqlSessionFactory);

        Map<String , Object> parameterValues = new HashMap<>();
        LocalDate to = LocalDate.now().minusDays(2);
        LocalDate from = LocalDate.MIN;
        parameterValues.put("from", from);
        parameterValues.put("to", to);

        builder.queryId(findMapperId.get())
            .parameterValues(parameterValues);

        return builder.build();
    }

    @Override
    public void writer(
        Chunk<? extends Future<File>> futures,
        Optional<String> SaveMapper,
        Converter<File, ?> itemToParameterConverter
    ) throws Exception {

        Optional<String> saveMapperId = Optional.of("com.anamensis.server.mapper.FileMapper.disabledDummyFile");

        super.writer(futures, saveMapperId, (file) -> {
            Map<String, Object> parameter = new HashMap<>();
            try {
                parameter.put("id", file.getId());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

            return parameter;
        });
    }

    @Override
    public File delegate(File file) {
        String thumbnailFilename = file.getFilePath()
            + file.getFileName().substring(0, file.getFileName().lastIndexOf("."))
            + "_thumb"
            + file.getFileName().substring(file.getFileName().lastIndexOf("."));

        fileProvider.deleteFile(file.getFullPath());
        fileProvider.deleteFile(thumbnailFilename);

        return file;
    }
}
