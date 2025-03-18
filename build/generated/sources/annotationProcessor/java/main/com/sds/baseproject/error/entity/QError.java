package com.sds.baseproject.error.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QError is a Querydsl query type for Error
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QError extends EntityPathBase<Error> {

    private static final long serialVersionUID = 640900482L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QError error = new QError("error");

    public final NumberPath<Long> errorId = createNumber("errorId", Long.class);

    public final StringPath message = createString("message");

    public final DateTimePath<java.time.OffsetDateTime> regDatetime = createDateTime("regDatetime", java.time.OffsetDateTime.class);

    public final StringPath regId = createString("regId");

    public final com.sds.baseproject.user.entity.QUser regUser;

    public final StringPath stacktrace = createString("stacktrace");

    public QError(String variable) {
        this(Error.class, forVariable(variable), INITS);
    }

    public QError(Path<? extends Error> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QError(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QError(PathMetadata metadata, PathInits inits) {
        this(Error.class, metadata, inits);
    }

    public QError(Class<? extends Error> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.regUser = inits.isInitialized("regUser") ? new com.sds.baseproject.user.entity.QUser(forProperty("regUser"), inits.get("regUser")) : null;
    }

}

