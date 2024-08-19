package com.anamensis.batch.job.boardIndex;

import com.anamensis.batch.entity.Board;
import com.anamensis.batch.entity.BoardIndex;
import com.anamensis.batch.job.factory.AbstractMybatisStep;
import com.anamensis.batch.mapper.BoardIndexMapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.json.JSONArray;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;

@Component
public class BoardIndexStep extends AbstractMybatisStep<Board, BoardIndex> {

    @Autowired
    private BoardIndexMapper boardIndexMapper;

    public BoardIndexStep(SqlSessionFactory sqlSessionFactory, VirtualThreadTaskExecutor taskExecutor) {
        super(sqlSessionFactory, taskExecutor);
    }

    @Override
    public Step step(
        int chunkSize,
        String jobName,
        JobRepository jobRepository,
        PlatformTransactionManager tm
    ) {
        boardIndexMapper.deleteAll();
        return super.step(chunkSize, jobName, jobRepository, tm);
    }

    @Override
    public void writer(
        Chunk<? extends Future<BoardIndex>> futures,
        Optional<String> SaveMapper,
        Converter<BoardIndex, ?> itemToParameterConverter
    ) throws Exception {
        Optional<String> saveMapperId = Optional.of("com.anamensis.batch.mapper.BoardIndexMapper.save");
        super.writer(futures, saveMapperId, itemToParameterConverter);
    }

    @Override
    public MyBatisCursorItemReader<Board> reader(Optional<String> findMapper, String ids) {
        Optional<String> findMapperId = Optional.of("com.anamensis.batch.mapper.BoardMapper.findAllByIsUse");
        return super.reader(findMapperId, null);
    }

    @Override
    public BoardIndex delegate(Board board) {
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
