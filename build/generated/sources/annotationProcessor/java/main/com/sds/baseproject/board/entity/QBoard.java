package com.sds.baseproject.board.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBoard is a Querydsl query type for Board
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoard extends EntityPathBase<Board> {

    private static final long serialVersionUID = -1625967038L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBoard board = new QBoard("board");

    public final com.sds.baseproject.user.entity.QBaseEntity _super;

    public final SetPath<com.sds.baseproject.file.entity.AttachmentFile, com.sds.baseproject.file.entity.QAttachmentFile> attachmentFiles = this.<com.sds.baseproject.file.entity.AttachmentFile, com.sds.baseproject.file.entity.QAttachmentFile>createSet("attachmentFiles", com.sds.baseproject.file.entity.AttachmentFile.class, com.sds.baseproject.file.entity.QAttachmentFile.class, PathInits.DIRECT2);

    public final StringPath bbsId = createString("bbsId");

    public final StringPath boardId = createString("boardId");

    public final StringPath content = createString("content");

    public final BooleanPath deleted = createBoolean("deleted");

    public final StringPath deletedYn = createString("deletedYn");

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> modDatetime;

    //inherited
    public final StringPath modId;

    // inherited
    public final com.sds.baseproject.user.entity.QUser modUser;

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> regDatetime;

    //inherited
    public final StringPath regId;

    // inherited
    public final com.sds.baseproject.user.entity.QUser regUser;

    public final StringPath title = createString("title");

    public final QBoard upperBoard;

    public final StringPath upperBoardId = createString("upperBoardId");

    public QBoard(String variable) {
        this(Board.class, forVariable(variable), INITS);
    }

    public QBoard(Path<? extends Board> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBoard(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBoard(PathMetadata metadata, PathInits inits) {
        this(Board.class, metadata, inits);
    }

    public QBoard(Class<? extends Board> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new com.sds.baseproject.user.entity.QBaseEntity(type, metadata, inits);
        this.modDatetime = _super.modDatetime;
        this.modId = _super.modId;
        this.modUser = _super.modUser;
        this.regDatetime = _super.regDatetime;
        this.regId = _super.regId;
        this.regUser = _super.regUser;
        this.upperBoard = inits.isInitialized("upperBoard") ? new QBoard(forProperty("upperBoard"), inits.get("upperBoard")) : null;
    }

}

