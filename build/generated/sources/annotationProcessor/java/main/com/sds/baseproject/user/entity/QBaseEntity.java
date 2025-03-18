package com.sds.baseproject.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBaseEntity is a Querydsl query type for BaseEntity
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseEntity extends EntityPathBase<BaseEntity> {

    private static final long serialVersionUID = 208774523L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBaseEntity baseEntity = new QBaseEntity("baseEntity");

    public final DateTimePath<java.time.OffsetDateTime> modDatetime = createDateTime("modDatetime", java.time.OffsetDateTime.class);

    public final StringPath modId = createString("modId");

    public final QUser modUser;

    public final DateTimePath<java.time.OffsetDateTime> regDatetime = createDateTime("regDatetime", java.time.OffsetDateTime.class);

    public final StringPath regId = createString("regId");

    public final QUser regUser;

    public QBaseEntity(String variable) {
        this(BaseEntity.class, forVariable(variable), INITS);
    }

    public QBaseEntity(Path<? extends BaseEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBaseEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBaseEntity(PathMetadata metadata, PathInits inits) {
        this(BaseEntity.class, metadata, inits);
    }

    public QBaseEntity(Class<? extends BaseEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.modUser = inits.isInitialized("modUser") ? new QUser(forProperty("modUser"), inits.get("modUser")) : null;
        this.regUser = inits.isInitialized("regUser") ? new QUser(forProperty("regUser"), inits.get("regUser")) : null;
    }

}

