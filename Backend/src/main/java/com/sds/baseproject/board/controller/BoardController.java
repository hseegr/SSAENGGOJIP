package com.sds.baseproject.board.controller;

import com.sds.baseproject.board.payload.BoardRequest;
import com.sds.baseproject.board.payload.BoardSearchRequest;
import com.sds.baseproject.board.payload.BoardSummary;
import com.sds.baseproject.board.payload.BoardSummaryForList;
import com.sds.baseproject.board.service.BoardService;
import com.sds.baseproject.common.paylod.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bbs/{bbsId}/boards")
@Secured({"ROLE_SYSADMIN"})
@Tag(name = "게시판 관리", description = "게시글의 글을 등록, 수정하거나 조회할 수 있습니다.")
public class BoardController {
    private final BoardService boardService;

    @GetMapping
    @Operation(summary = "게시글 목록 조회", description = "게시글의 목록을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "게시글 목록")
    public ResponseEntity<Page<BoardSummaryForList>> getBoardPage(
            @Parameter(description = "게시판 구분 ID (notice : 공지사항, free : 자유게시판)", example = "notice")
            @PathVariable String bbsId,
            @Parameter(description = "게시판 목록을 검색하기 위한 키워드") BoardSearchRequest searchRequest,
            @Parameter(description = "페이징 처리에 필요한 정보 객체") Pageable pageable) {
        return ResponseEntity.ok(boardService.getBoardPage(bbsId, searchRequest, pageable));
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "게시글 상세 화면 조회", description = "게시글의 상세 화면 조회을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "게시글의 상세 정보")
    public ResponseEntity<BoardSummary> getBoard(
            @Parameter(description = "게시판 구분 ID (notice : 공지사항, free : 자유게시판)", example = "notice")
            @PathVariable String bbsId,
            @Parameter(description = "게시판 목록을 검색하기 위한 키워드")
            @PathVariable String boardId) {
        return ResponseEntity.ok(this.boardService.getBoard(bbsId, boardId));
    }

    @PostMapping
    @Operation(summary = "게시글 등록", description = "게시글을 등록한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "게시글 등록 완료")
    public ResponseEntity<ApiResponse> saveBoard(
            @Parameter(description = "게시판 구분 ID (notice : 공지사항, free : 자유게시판)", example = "notice")
            @PathVariable String bbsId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록할 게시글의 정보")
            @RequestBody BoardRequest boardRequest) {
        return ResponseEntity.ok(this.boardService.saveBoard(bbsId, boardRequest));
    }

    @PatchMapping("/{boardId}")
    @Operation(summary = "게시글 수정", description = "게시글을 수정한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "게시글 수정 완료")
    public ResponseEntity<ApiResponse> updateBoard(
            @Parameter(description = "게시판 구분 ID (notice : 공지사항, free : 자유게시판)", example = "notice")
            @PathVariable String bbsId,
            @Parameter(description = "수정할 게시글의 ID")
            @PathVariable String boardId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 게시글의 정보")
            @RequestBody BoardRequest boardRequest) {
        return ResponseEntity.ok(this.boardService.updateBoard(boardId, boardRequest));
    }
}
