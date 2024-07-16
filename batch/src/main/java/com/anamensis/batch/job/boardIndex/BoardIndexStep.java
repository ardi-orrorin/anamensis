package com.anamensis.batch.job.boardIndex;

import com.anamensis.batch.entity.*;
import com.anamensis.batch.mapper.BoardIndexMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.json.JSONArray;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
public class BoardIndexStep {

    private final SqlSessionFactory sqlSessionFactory;
    private final VirtualThreadTaskExecutor taskExecutor;
    private final BoardIndexMapper boardIndexMapper;


    /**
     * Board index step step.
     * chunk size = 200의 경우 java heap size = 2G 이상 추천
     *
     * @return the step
     */
    public Step boardIndexStep(JobRepository jobRepository, PlatformTransactionManager tm) {
        boardIndexMapper.deleteAll();

        return new StepBuilder("board-index-step", jobRepository)
                .<Board, Future<BoardIndex>>chunk(200, tm)
                .reader(myBatisCursorItemReader())
                .processor(this::asyncBoardIndexProcessor)
                .writer(this::save)
                .allowStartIfComplete(true)
                .build();
    }

    private void save(Chunk<? extends Future<BoardIndex>> futures) {
        new MyBatisBatchItemWriterBuilder<Future<BoardIndex>>()
            .sqlSessionFactory(sqlSessionFactory)
            .statementId("com.anamensis.batch.mapper.BoardIndexMapper.save")
            .itemToParameterConverter(boardIndexFuture -> {
                try {
                    return boardIndexFuture.get();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            })
            .build()
            .write(futures);
    }

    private MyBatisCursorItemReader<Board> myBatisCursorItemReader() {
        MyBatisCursorItemReaderBuilder<Board> builder = new MyBatisCursorItemReaderBuilder<Board>()
            .sqlSessionFactory(sqlSessionFactory);

        return builder
            .queryId("com.anamensis.batch.mapper.BoardMapper.findAllByIsUse")
            .build();
    }

    private Future<BoardIndex> asyncBoardIndexProcessor(Board board) throws Exception {
        AsyncItemProcessor<Board, BoardIndex> asyncItemProcessor = new AsyncItemProcessor<>();
        asyncItemProcessor.setDelegate(this::transferToBoardIndex);
        asyncItemProcessor.setTaskExecutor(taskExecutor);
        return asyncItemProcessor.process(board);
    }

    private BoardIndex transferToBoardIndex(Board board) {
        JSONArray array = board.getContent().getJSONArray("list");
        String content = this.getIndexContent(board.getTitle(), array);

        BoardIndex bi = new BoardIndex();
        bi.setBoardId(board.getId());
        bi.setContent(content);
        bi.setCreatedAt(LocalDateTime.now());
        bi.setUpdatedAt(LocalDateTime.now());
        return bi;
    }

    private String getIndexContent(String title, JSONArray array) {
        List<String> skipCodeBlock = List.of("00101", "00201", "00203", "00204", "00302");
        return title + " " + array.toList().stream().map(item -> {
            var objectMap = (Map<String, Object>) item;
            String code = objectMap.get("code").toString();

            if(skipCodeBlock.contains(code)) return "";

            return objectMap.get("value").toString();
        }).reduce((acc, next) ->
            acc + " " + next
        ).get();
    }

}
