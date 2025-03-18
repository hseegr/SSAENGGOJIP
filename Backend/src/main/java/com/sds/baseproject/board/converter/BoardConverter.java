package com.sds.baseproject.board.converter;

import com.sds.baseproject.board.entity.Board;
import com.sds.baseproject.board.payload.BoardRequest;
import com.sds.baseproject.board.payload.BoardSummary;
import com.sds.baseproject.board.payload.BoardSummaryForList;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BoardConverter {
    Board toEntity(BoardRequest boardRequest);

    void updateBoard(@MappingTarget Board board, BoardRequest boardRequest);

    BoardSummary toBoardSummary(Board board);

    BoardSummaryForList toBoardSummaryForList(Board board);
}
