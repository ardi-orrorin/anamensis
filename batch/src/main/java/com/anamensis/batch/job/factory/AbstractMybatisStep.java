package com.anamensis.batch.job.factory;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.integration.async.AsyncItemProcessor;
import org.springframework.batch.integration.async.AsyncItemWriter;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;

public abstract class AbstractMybatisStep<I, O> implements InterfaceStep<MyBatisCursorItemReader<I>, O, I> {

    private final SqlSessionFactory sqlSessionFactory;
    private final VirtualThreadTaskExecutor taskExecutor;

    protected AbstractMybatisStep(SqlSessionFactory sqlSessionFactory, VirtualThreadTaskExecutor taskExecutor) {
        this.sqlSessionFactory = sqlSessionFactory;
        this.taskExecutor = taskExecutor;
    }

    @Override
    public Step step(
        int chunkSize,
        String jobName,
        JobRepository jobRepository,
        PlatformTransactionManager tm
    ) {
        return new StepBuilder(jobName + "-step", jobRepository)
            .<I, Future<O>>chunk(chunkSize, tm)
            .reader(reader(null, null))
            .processor(this::asyncProcessor)
            .writer((futures) -> writer(futures, null, null))
            .allowStartIfComplete(true)
            .build();
    }

    @Override
    public MyBatisCursorItemReader<I> reader(Optional<String> findMapper, @Value("#{jobParameters['ids']}") String ids) {

        String queryId = findMapper.orElseThrow(() -> new IllegalArgumentException("findMapper is required"));

        MyBatisCursorItemReaderBuilder<I> builder = new MyBatisCursorItemReaderBuilder<I>()
            .sqlSessionFactory(sqlSessionFactory);

        if (ids != null && !ids.equals("")) {
            Map<String, Object> map = new HashMap<>();
            List<String> idList = List.of(ids.split(","));
            map.put("ids", idList);

            builder.parameterValues(map)
                .queryId(queryId);
        } else {
            builder.queryId(queryId);
        }

        return builder.build();
    }

    @Override
    public Future<O> asyncProcessor(I input) throws Exception {
        AsyncItemProcessor<I, O> asyncItemProcessor = new AsyncItemProcessor<>();
        asyncItemProcessor.setDelegate(this::delegate);
        asyncItemProcessor.setTaskExecutor(taskExecutor);
        return asyncItemProcessor.process(input);
    }

    @Override
    public O delegate(I input) {
        return null;
    }

    @Override
    public void writer(
        Chunk<? extends Future<O>> futures,
        Optional<String> SaveMapper,
        Converter<O, ?> itemToParameterConverter
    ) throws Exception  {

        String statementId = SaveMapper.orElseThrow(() -> new IllegalArgumentException("SaveMapper is required"));

        AsyncItemWriter<O> asyncItemWriter = new AsyncItemWriter<>();

        MyBatisBatchItemWriterBuilder<O> builder = new MyBatisBatchItemWriterBuilder<O>()
            .sqlSessionFactory(sqlSessionFactory)
            .itemToParameterConverter((item) -> item)
            .statementId(statementId);

        if(itemToParameterConverter != null) {
            builder.itemToParameterConverter(itemToParameterConverter);
        }

        MyBatisBatchItemWriter<O> writer = builder.build();

        asyncItemWriter.setDelegate(writer);
        asyncItemWriter.write(futures);
    }
}
