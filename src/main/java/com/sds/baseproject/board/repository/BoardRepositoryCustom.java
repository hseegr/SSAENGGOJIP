package com.sds.baseproject.board.repository;

import com.sds.baseproject.board.entity.Board;
import com.sds.baseproject.board.payload.BoardSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardRepositoryCustom {
    Page<Board> getBoardPage(String bbsId, BoardSearchRequest searchRequest, Pageable pageable);
}
