package com.anamensis.server.batch.job.factory;

import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.Optional;
import java.util.concurrent.Future;

public interface InterfaceStep<R, O ,I> {

    Step step(int chunkSize, String jobName, JobRepository jobRepository, PlatformTransactionManager tm);

    R reader(Optional<String> findMapper, @Value("#{jobParameters['ids']}") String ids);

    Future<O> asyncProcessor(I input) throws Exception;

    O delegate(I input);
    void writer(Chunk<? extends Future<O>> futures, Optional<String> SaveMapper, Converter<O, ?> itemToParameterConverter) throws Exception;

}
