package com.sds.baseproject.board.service;

import com.sds.baseproject.board.converter.BoardConverter;
import com.sds.baseproject.board.entity.Board;
import com.sds.baseproject.board.payload.BoardRequest;
import com.sds.baseproject.board.payload.BoardSearchRequest;
import com.sds.baseproject.board.payload.BoardSummary;
import com.sds.baseproject.board.payload.BoardSummaryForList;
import com.sds.baseproject.board.repository.BoardRepository;
import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.file.service.AttachmentFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {
    private final BoardRepository boardRepository;

    private final BoardConverter boardConverter;

    private final AttachmentFileService attachmentFileService;

    @Override
    public Page<BoardSummaryForList> getBoardPage(String bbsId, BoardSearchRequest searchRequest, Pageable pageable) {
        return this.boardRepository.getBoardPage(bbsId, searchRequest, pageable)
                .map(this.boardConverter::toBoardSummaryForList);
    }

    @Override
    public BoardSummary getBoard(String bbsId, String boardId) {
        Board board = this.boardRepository.getReferenceById(boardId);

        if (!board.getBbsId().equals(bbsId)) {
            throw new IllegalArgumentException("bbs id not match");
        }
        return this.boardConverter.toBoardSummary(board);
    }

    @Override
    @Transactional
    public ApiResponse saveBoard(String bbsId, BoardRequest boardRequest) {
        Board board = this.boardConverter.toEntity(boardRequest);
        board.setBbsId(bbsId);
        board = this.boardRepository.save(board);

        this.attachmentFileService.updateFileRefId(board.getBoardId(), board.getBbsId(), boardRequest.getAttachmentFileIds());

        return new ApiResponse(true, "saved", board.getBoardId());
    }

    @Override
    @Transactional
    public ApiResponse updateBoard(String boardId, BoardRequest boardRequest) {
        Board board = this.boardRepository.getReferenceById(boardId);
        this.boardConverter.updateBoard(board, boardRequest);
        this.boardRepository.save(board);

        this.attachmentFileService.updateFileRefId(boardId, board.getBbsId(), boardRequest.getAttachmentFileIds());

        return new ApiResponse(true, "updated", board.getBoardId());
    }
}
