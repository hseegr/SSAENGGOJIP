package com.sds.baseproject.board.converter;

import com.sds.baseproject.board.entity.Board;
import com.sds.baseproject.board.payload.BoardRequest;
import com.sds.baseproject.board.payload.BoardSummary;
import com.sds.baseproject.board.payload.BoardSummaryForList;
import com.sds.baseproject.file.entity.AttachmentFile;
import com.sds.baseproject.file.payload.AttachmentFileSummary;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserSummarySimple;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-18T13:02:01+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.7.jar, environment: Java 21.0.5 (Amazon.com Inc.)"
)
@Component
public class BoardConverterImpl implements BoardConverter {

    @Override
    public Board toEntity(BoardRequest boardRequest) {
        if ( boardRequest == null ) {
            return null;
        }

        Board board = new Board();

        board.setTitle( boardRequest.getTitle() );
        board.setContent( boardRequest.getContent() );
        board.setUpperBoardId( boardRequest.getUpperBoardId() );

        return board;
    }

    @Override
    public void updateBoard(Board board, BoardRequest boardRequest) {
        if ( boardRequest == null ) {
            return;
        }

        board.setTitle( boardRequest.getTitle() );
        board.setContent( boardRequest.getContent() );
        board.setUpperBoardId( boardRequest.getUpperBoardId() );
    }

    @Override
    public BoardSummary toBoardSummary(Board board) {
        if ( board == null ) {
            return null;
        }

        BoardSummary boardSummary = new BoardSummary();

        boardSummary.setBoardId( board.getBoardId() );
        boardSummary.setBbsId( board.getBbsId() );
        boardSummary.setTitle( board.getTitle() );
        boardSummary.setContent( board.getContent() );
        boardSummary.setUpperBoardId( board.getUpperBoardId() );
        boardSummary.setModUser( userToUserSummarySimple( board.getModUser() ) );
        boardSummary.setModDatetime( board.getModDatetime() );
        boardSummary.setAttachmentFiles( attachmentFileSetToAttachmentFileSummaryList( board.getAttachmentFiles() ) );

        return boardSummary;
    }

    @Override
    public BoardSummaryForList toBoardSummaryForList(Board board) {
        if ( board == null ) {
            return null;
        }

        BoardSummaryForList boardSummaryForList = new BoardSummaryForList();

        boardSummaryForList.setBoardId( board.getBoardId() );
        boardSummaryForList.setTitle( board.getTitle() );
        boardSummaryForList.setModUser( userToUserSummarySimple( board.getModUser() ) );
        boardSummaryForList.setModDatetime( board.getModDatetime() );

        return boardSummaryForList;
    }

    protected UserSummarySimple userToUserSummarySimple(User user) {
        if ( user == null ) {
            return null;
        }

        UserSummarySimple userSummarySimple = new UserSummarySimple();

        userSummarySimple.setUserId( user.getUserId() );
        userSummarySimple.setLoginId( user.getLoginId() );
        userSummarySimple.setName( user.getName() );

        return userSummarySimple;
    }

    protected AttachmentFileSummary attachmentFileToAttachmentFileSummary(AttachmentFile attachmentFile) {
        if ( attachmentFile == null ) {
            return null;
        }

        AttachmentFileSummary attachmentFileSummary = new AttachmentFileSummary();

        attachmentFileSummary.setFileId( attachmentFile.getFileId() );
        attachmentFileSummary.setFileType( attachmentFile.getFileType() );
        attachmentFileSummary.setFileName( attachmentFile.getFileName() );
        attachmentFileSummary.setFileSize( attachmentFile.getFileSize() );
        attachmentFileSummary.setOrderIdx( attachmentFile.getOrderIdx() );

        return attachmentFileSummary;
    }

    protected List<AttachmentFileSummary> attachmentFileSetToAttachmentFileSummaryList(Set<AttachmentFile> set) {
        if ( set == null ) {
            return null;
        }

        List<AttachmentFileSummary> list = new ArrayList<AttachmentFileSummary>( set.size() );
        for ( AttachmentFile attachmentFile : set ) {
            list.add( attachmentFileToAttachmentFileSummary( attachmentFile ) );
        }

        return list;
    }
}
