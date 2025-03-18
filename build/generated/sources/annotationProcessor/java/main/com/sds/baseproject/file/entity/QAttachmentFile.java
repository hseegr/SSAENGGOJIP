package com.sds.baseproject.file.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QAttachmentFile is a Querydsl query type for AttachmentFile
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QAttachmentFile extends EntityPathBase<AttachmentFile> {

    private static final long serialVersionUID = 1503370263L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QAttachmentFile attachmentFile = new QAttachmentFile("attachmentFile");

    public final com.sds.baseproject.user.entity.QBaseEntity _super;

    public final BooleanPath deleted = createBoolean("deleted");

    public final StringPath deletedYn = createString("deletedYn");

    public final StringPath fileId = createString("fileId");

    public final StringPath fileName = createString("fileName");

    public final NumberPath<Long> fileSize = createNumber("fileSize", Long.class);

    public final StringPath fileType = createString("fileType");

    public final StringPath hash = createString("hash");

    public final StringPath mimeType = createString("mimeType");

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> modDatetime;

    //inherited
    public final StringPath modId;

    // inherited
    public final com.sds.baseproject.user.entity.QUser modUser;

    public final NumberPath<Integer> orderIdx = createNumber("orderIdx", Integer.class);

    public final StringPath refId = createString("refId");

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> regDatetime;

    //inherited
    public final StringPath regId;

    // inherited
    public final com.sds.baseproject.user.entity.QUser regUser;

    public QAttachmentFile(String variable) {
        this(AttachmentFile.class, forVariable(variable), INITS);
    }

    public QAttachmentFile(Path<? extends AttachmentFile> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QAttachmentFile(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QAttachmentFile(PathMetadata metadata, PathInits inits) {
        this(AttachmentFile.class, metadata, inits);
    }

    public QAttachmentFile(Class<? extends AttachmentFile> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new com.sds.baseproject.user.entity.QBaseEntity(type, metadata, inits);
        this.modDatetime = _super.modDatetime;
        this.modId = _super.modId;
        this.modUser = _super.modUser;
        this.regDatetime = _super.regDatetime;
        this.regId = _super.regId;
        this.regUser = _super.regUser;
    }

}

