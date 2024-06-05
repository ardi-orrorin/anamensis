package com.anamensis.server.controller;

import com.anamensis.server.dto.request.BoardCommentRequest;
import com.anamensis.server.dto.response.BoardCommentResponse;
import com.anamensis.server.entity.BoardComment;
import com.anamensis.server.service.BoardCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/board/comments")
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;

    @PublicAPI
    @GetMapping("")
    public Mono<List<BoardCommentResponse.Comment>> list(
            @RequestParam long boardPk,
            @AuthenticationPrincipal UserDetails user
    ) {
        String userId = user != null ? user.getUsername() : null;
        return boardCommentService.findAllByBoardPk(boardPk)
                .map(board -> BoardCommentResponse.Comment.fromResultMap(board, userId))
                .collectList();
    }

    @PostMapping("")
    public Mono<Boolean> save(
            @Valid @RequestBody BoardCommentRequest.Save comment,
            @AuthenticationPrincipal UserDetails user
    ) {
        BoardComment bc = BoardCommentRequest.Save.toEntity(comment, user);
        return boardCommentService.save(bc);
    }

    @DeleteMapping("/{id}")
    public Mono<Boolean> delete(
            @PathVariable long id,
            @AuthenticationPrincipal UserDetails user
    ) {
        return boardCommentService.delete(id, user.getUsername());
    }

}
