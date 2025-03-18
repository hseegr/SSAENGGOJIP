package com.sds.baseproject.board.service;

import com.sds.baseproject.board.payload.BoardRequest;
import com.sds.baseproject.board.payload.BoardSearchRequest;
import com.sds.baseproject.board.payload.BoardSummary;
import com.sds.baseproject.board.payload.BoardSummaryForList;
import com.sds.baseproject.common.paylod.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardService {

    Page<BoardSummaryForList> getBoardPage(String bbsId, BoardSearchRequest searchRequest, Pageable pageable);

    BoardSummary getBoard(String bbsId, String boardId);

    ApiResponse saveBoard(String bbsId, BoardRequest boardRequest);

    ApiResponse updateBoard(String boardId, BoardRequest boardRequest);
}
