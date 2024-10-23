package com.anamensis.server.batch.job.boardIndex;

import com.anamensis.server.mapper.BoardIndexMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class BoardIndexJob {

    @Autowired
    private BoardIndexMapper boardIndexMapper;

    private final JobRepository jobRepository;

    private final PlatformTransactionManager tm;

    private final BoardIndexStep boardIndexStep;

    @Bean("board-index-job")
    public Job boardIndexJob() {
        return new JobBuilder("board-index-job", jobRepository)
            .start(deleteAllBoardIndex(jobRepository, tm))
            .next(boardIndexStep.step(5, "board-index-step", jobRepository, tm))
            .incrementer(new RunIdIncrementer())
            .build();
    }

    private Step deleteAllBoardIndex(JobRepository jobRepository, PlatformTransactionManager tm) {
        return new StepBuilder("delete-all-step", jobRepository)
            .tasklet((contribution, chunkContext) -> {
                boardIndexMapper.deleteAll();
                return RepeatStatus.FINISHED;
            }, tm)
            .allowStartIfComplete(true)
            .build();
    }
}
