package com.anamensis.batch.job.dummyfile;

import com.anamensis.batch.entity.File;
import com.anamensis.batch.job.factory.AbstractMybatisStep;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;

@Component
public class DummyFileStep extends AbstractMybatisStep<File, File> {


    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Autowired
    private S3Client s3Client;

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

        Optional<String> findMapperId = Optional.of("com.anamensis.batch.mapper.FileMapper.selectDummyFile");

        MyBatisCursorItemReaderBuilder<File> builder = new MyBatisCursorItemReaderBuilder<File>()
            .sqlSessionFactory(sqlSessionFactory);

        Map<String , Object> parameterValues = new HashMap<>();
        LocalDate to = LocalDate.now().minusDays(2);
        LocalDate from = to.minusDays(5);
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

        Optional<String> saveMapperId = Optional.of("com.anamensis.batch.mapper.FileMapper.disabledDummyFile");

        super.writer(futures, saveMapperId, (file) -> {
            Map<String, Object> parameter = new HashMap<>();
            try {
                parameter.put("id", file.id());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

            return parameter;
        });
    }

    @Override
    public File delegate(File file) {
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
