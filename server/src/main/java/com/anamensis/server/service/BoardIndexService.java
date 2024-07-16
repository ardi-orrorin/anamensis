package com.anamensis.server.service;

import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.BoardIndex;
import com.anamensis.server.mapper.BoardIndexMapper;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardIndexService {

    private final BoardIndexMapper boardIndexMapper;

    public Mono<Boolean> save(Board board) {
        return Mono.fromCallable(() ->
            boardIndexMapper.save(getBoardIndex(board)) > 0
        );
    }

    public Mono<Boolean> update(Board board) {
        return Mono.fromCallable(() ->
            boardIndexMapper.update(getBoardIndex(board)) > 0
        );
    }

    public Mono<Boolean> delete(long boardId) {
        return Mono.fromCallable(() ->
            boardIndexMapper.delete(boardId) > 0
        );
    }

    private BoardIndex getBoardIndex(Board board) {
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
